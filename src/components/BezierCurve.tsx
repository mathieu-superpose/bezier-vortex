import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"

import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js"
import { floor, Fn, fract, uniform, uv, vec4 } from "three/tsl"

import * as THREE from "three/webgpu"

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
  const geometry = useMemo(() => {
    return new ParametricGeometry(paraFunction, 32, 32)
  }, [])
  const playhead = uniform(10.5)

  const setColorNode = () => {
    let row = floor(fract(uv().y.add(playhead)).mul(20))
    return vec4(row.div(10), 0, 0, 1)
  }

  const material = useMemo(() => {
    const material = new THREE.MeshPhysicalNodeMaterial({
      roughness: 0.5,
      metalness: 0.5,
    })

    material.colorNode = setColorNode()

    return material
  }, [])

  useFrame((state) => {
    playhead.value = state.clock.getElapsedTime()
    material.colorNode = setColorNode()
  })

  return (
    <group position={[0, 38, 48]} rotation={[1.5, 0, 0]}>
      <mesh geometry={geometry} material={material} />
    </group>
  )
}

export default BezierCurve
