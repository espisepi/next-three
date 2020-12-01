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

const GatacattanaPage = () => {
  return [
    <Canvas camera={{ position: [0, 0, 35] }} style={{position: 'absolute'}}>
      <ambientLight intensity={2} />
      <Background url='assets/musica/gotham.mp4' />
      <Ocean geometry={new THREE.BoxBufferGeometry( 500, 500, 500 )} position={[0,240,0]} />
      
      <SimondevPersonController />
    </Canvas>,
    <Joystick />,
    <Fullscreen />
  ]
}

export default GatacattanaPage
