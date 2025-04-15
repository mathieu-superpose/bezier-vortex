import * as THREE from "three"
import { PerspectiveCamera } from "@react-three/drei"

import Environment from "./components/Environment"
import BezierCurve from "./components/BezierCurve"
import { useEffect, useRef } from "react"

function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  useEffect(() => {
    if (!cameraRef?.current) {
      return
    }
    const camRatio = 1.05
    cameraRef.current.position.set(0, 46 * camRatio, 52 * camRatio)
    cameraRef.current.lookAt(0, -14, 18)
  }, [])

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={75} />

      <Environment />

      <BezierCurve />
    </>
  )
}

export default Scene
