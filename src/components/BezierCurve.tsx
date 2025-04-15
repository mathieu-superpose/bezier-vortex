import { useMemo } from "react"
import * as THREE from "three/webgpu"
import { fract, texture, uniform, uv, vec4 } from "three/tsl"
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"

function bezier(a: number, b: number, c: number, d: number, t: number) {
  const oneMinusT = 1 - t
  return (
    a * oneMinusT * oneMinusT * oneMinusT +
    3 * b * oneMinusT * oneMinusT * t +
    3 * c * oneMinusT * t * t +
    d * t * t * t
  )
}

function getRadius(t: number) {
  return bezier(100, 1, 1, 1, t)
}

const paraFunction = function (u: number, v: number, target: THREE.Vector3) {
  const r = getRadius(v)
  const x = r * Math.sin(u * Math.PI * 2)
  const y = r * Math.cos(u * Math.PI * 2)
  const z = -1 * (v - 0.5) * 20

  target.set(x, y, z)
}

function BezierCurve() {
  const myMap = useTexture("vortex.png")
  myMap.colorSpace = THREE.SRGBColorSpace
  myMap.minFilter = THREE.LinearFilter
  myMap.magFilter = THREE.LinearFilter
  myMap.wrapS = THREE.RepeatWrapping
  myMap.wrapT = THREE.RepeatWrapping
  myMap.repeat.set(1, 1)

  const geometry = useMemo(() => {
    return new ParametricGeometry(paraFunction, 128, 128)
  }, [])
  const playhead = uniform(10.5)

  const setColorNode = () => {
    let row = fract(uv().x.add(playhead))
    let col = fract(uv().y.add(playhead))

    let newUV = vec4(row, col, 0, 1)

    return texture(myMap, newUV)
  }

  const material = useMemo(() => {
    const material = new THREE.MeshPhysicalNodeMaterial({
      roughness: 0.5,
      metalness: 0.5,
    })

    return material
  }, [])

  useFrame((state) => {
    playhead.value = -1 * state.clock.getElapsedTime() * 0.05

    material.colorNode = setColorNode()
  })

  return (
    <group position={[0, 38, 48]} rotation={[1.5, 0, 0]}>
      <mesh geometry={geometry} material={material} />
    </group>
  )
}

export default BezierCurve
