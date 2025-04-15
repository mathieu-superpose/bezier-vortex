function Environment() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight intensity={2} position={[25, 10, 10]} />
    </>
  )
}

export default Environment
