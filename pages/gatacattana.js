import React, { Suspense, useEffect, useRef, useState, useMemo, useCallback } from 'react';
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

function AssetGltf({ url, speed = 1 }) {

    /* --------- Load horse ----------- */
    const { nodes, materials, animations } = useLoader(GLTFLoader, url);

    /* --------- Material horse ---------- */
    const [tRoad, tLut] = useLoader(THREE.TextureLoader, [ 'assets/img/gatacattana/road.jpg', 'assets/img/gatacattana/lut.png'])
    const { gl, scene } = useThree();
    const canvas = gl.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const resolution = useMemo(()=>(new THREE.Vector2(width, height)),[width, height]) ;

    const uniforms = Object.assign({}, THREE.UniformsLib.lights, {
        iResolution: { value: resolution },
        iChannel0: { value: scene.background },
        iChannel1: { value: tRoad },
        iLookup: { value: tLut },
        opacity: { value: 1 },
        diffuse: {  value: new THREE.Color(0xffffff) },
		iGlobalTime: {  value: 0 },
    });

    nodes.mesh_0.material.onBeforeCompile = function (shader) {
        shader.fragmentShader = ShaderHorse.fragmentShader;
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = 'varying vec2 vUv;\n' + shader.vertexShader;
        shader.vertexShader = 'uniform vec2 iResolution;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          [ 
            '#include <begin_vertex>',
            'vec4 newPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
            'vec2 screenPos = newPosition.xy / newPosition.w;',
            'vUv = screenPos;',
            'vUv.x *= iResolution.x / iResolution.y;'
          ].join('\n')
          );
    }


    /* --------- Animations horse --------- */
    const [ mixer ] = useState(() => new THREE.AnimationMixer());
    const group = useRef();
    useEffect(()=> void mixer.clipAction(animations[0], group.current).play(),[]);
    useFrame((state, delta) => {
        mixer.update(delta * speed);
    });

    return (
        <group ref={group} dispose={null} scale={[0.2,0.2,0.2]} position={[0,-7,0]} rotation={[0,Math.PI / 2, 0]}>
            <primitive object={nodes.mesh_0} />
        </group>
    );
}


const GatacattanaPage = () => {

  const [visible, setVisible] = useState(true);
  const changeVisible = useCallback(()=>{
      setVisible(v => !v)
  },[]);

  // 0: (3rd person)   ,   1: (1st person)
  const [zoomType, setZoomType] = useState(0);
  const changeZoom = useCallback(() => {
      setZoomType(z => !z)
  });
  
  return [
    <Canvas camera={{ position: [0, 0, 35] }} style={{position: 'absolute'}}>
      <ambientLight intensity={2} />
      <Background url='assets/musica/gotham.mp4' />
      <Ocean geometry={new THREE.BoxBufferGeometry( 500, 500, 500 )} position={[0,240,0]} />
      <SimondevPersonController visible={visible} zoomType={zoomType} />
      <Suspense fallback={null}>
            <AssetGltf url="assets/obj/Horse.glb" />
    </Suspense>
    </Canvas>,
    <Joystick />,
    <Fullscreen />,
    <div onClick={changeZoom} style={{ position:'absolute', width:'20px', height:'20px', bottom: 40, borderStyle: 'dashed', color: '#e60005', zIndex: 20 }}></div>,
    <div onClick={changeVisible} style={{ position:'absolute', width:'20px', height:'20px', bottom: 80, borderStyle: 'dashed', color: '#e60005', zIndex: 20 }}></div>
  ]
}

export default GatacattanaPage
