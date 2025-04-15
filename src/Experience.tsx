import * as THREE from "three/webgpu"
import { Canvas } from "@react-three/fiber"

import Scene from "./Scene"

function Experience() {
  return (
    <Canvas
      gl={async (props) => {
        const renderer = new THREE.WebGPURenderer(props as any)
        await renderer.init()
        return renderer
      }}
    >
      <Scene />
    </Canvas>
  )
}

export default Experience
