import { useMemo } from "react"
import * as THREE from "three/webgpu"
import {
  abs,
  floor,
  Fn,
  fract,
  sin,
  step,
  texture,
  uniform,
  uv,
  vec4,
} from "three/tsl"
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
  return bezier(100, 1, 1, 2.5, t)
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

  const setColorNode = Fn(() => {
    const blueColor = vec4(0, 0, 0.5, 1)

    let row = abs(floor(fract(uv().y.add(playhead)).mul(10)))
    let randomValue = fract(sin(row.mul(123)).mul(456789.123))

    let speedFactor = row.mul(0.25)

    let newuv = uv().toVar()

    newuv.y.addAssign(playhead)

    newuv.x.mulAssign(2).addAssign(playhead.mul(speedFactor)).mul(randomValue)

    const vortex = texture(myMap, newuv).sub(0.5)

    const color = step(vortex, blueColor).sub(0.4)

    return color
  })

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
