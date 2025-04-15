import { useMemo } from "react"
import * as THREE from "three"
import { MeshStandardMaterial } from "three"

import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js"

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
  return bezier(70, 1, 1, 1, t)
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
    return new ParametricGeometry(paraFunction, 8, 8)
  }, [])

  const material = useMemo(() => {
    const material = new MeshStandardMaterial({
      color: 0x1111aa,
    })

    return material
  }, [])

  return (
    <group position={[0, 38, 48]} rotation={[1.5, 0, 0]}>
      <mesh geometry={geometry} material={material} />
    </group>
  )
}

export default BezierCurve
