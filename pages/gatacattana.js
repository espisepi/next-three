import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree } from 'react-three-fiber';
import { OrbitControls, StandardEffects, Box } from 'drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Background from '../drei-espinaco/Background';
import Ocean from '../drei-espinaco/Ocean';
import SimondevPersonController from '../drei-espinaco/simondev/SimondevPersonController';
import Joystick from '../drei-espinaco/Joystick';
import Fullscreen from '../drei-espinaco/Fullscreen';
import ShaderHorse from '../drei-espinaco/shaders/shaderHorse';

const MyBox = (props) => {
  const mesh = useRef()

  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <Box
      args={[1, 1, 1]}
      {...props}
      ref={mesh}
      scale={active ? [6, 6, 6] : [5, 5, 5]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <meshStandardMaterial
        attach="material"
        color={hovered ? '#2b6c76' : '#720b23'}
      />
    </Box>
  )
}

const GatacattanaPage = () => {
  return [
    <Canvas camera={{ position: [0, 0, 35] }} style={{position: 'absolute'}}>
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      <MyBox position={[10, 0, 0]} />
      <MyBox position={[-10, 0, 0]} />
      <MyBox position={[0, 10, 0]} />
      <MyBox position={[0, -10, 0]} />
      <Suspense fallback={null}>
        <StandardEffects smaa />
      </Suspense>
      <SimondevPersonController />
    </Canvas>,
    <Joystick />,
    <Fullscreen />
  ]
}

export default GatacattanaPage
