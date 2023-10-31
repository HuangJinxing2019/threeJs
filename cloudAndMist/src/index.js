import  * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls";
import VERTEX_SOURCE from './shader/vertex.glsl?raw';
import FRAGMENT_SOURCE from './shader/gragment.glsl?raw';
import * as dat from "dat.gui";

const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, false);

// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 0.2;

document.body.append(renderer.domElement);
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 2
camera.position.y = 2
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

const scene = new THREE.Scene();

const params = {
    // uXFrequency: 30.0, // 根据x的大小弯曲频率
    // uZFrequency: 30.0, // 根据z的大小弯曲频率
    // uXRange: 0.09, // x值弯曲幅度
    // uZRange: 0.02, // z值弯曲幅度
    // uXSpeed: 0.001,
    // uZSpeed: 0.002,
    uRange: 0.9,
    uNoiseRange: 0.1,
    uNoiseSpeed: 0.001,
    uNoiseFrequency: 4.0,
    uHighColor: '#8e8e82',
    uLowColor: '#000000',
    uOpacity: 1.0,
}

const planeGeometry = new THREE.PlaneGeometry(1, 1, 1024, 1024);
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SOURCE,
    fragmentShader: FRAGMENT_SOURCE,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
        // uXFrequency: { value: params.uXFrequency },
        // uZFrequency: { value: params.uZFrequency },
        // uXRange: { value: params.uXRange },
        // uZRange: { value: params.uZRange },
        // uXSpeed: { value: params.uXSpeed },
        // uZSpeed: { value: params.uZSpeed },
        uTime: { value: 0 },
        uNoiseFrequency: { value: params.uNoiseFrequency},
        uNoiseSpeed: { value: params.uNoiseSpeed},
        uRange: { value: params.uRange},
        uNoiseRange: { value: params.uNoiseRange},
        uHighColor: { value: new THREE.Color(params.uHighColor) },
        uLowColor: { value: new THREE.Color(params.uLowColor) },
        uOpacity: { value: params.uOpacity},

    }
})
const mesh = new THREE.Mesh(planeGeometry, shaderMaterial);
mesh.rotation.x = - Math.PI / 2
scene.add(mesh)
function animate(time) {
    shaderMaterial.uniforms.uTime.value = time;
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()

const gui = new dat.GUI();
// gui.add(params, 'uXFrequency').min(10).max(200).step(1).onChange(value => {
//     shaderMaterial.uniforms.uXFrequency.value = value;
// })
// gui.add(params, 'uZFrequency').min(10).max(200).step(1).onChange(value => {
//     shaderMaterial.uniforms.uZFrequency.value = value;
// })
// gui.add(params, 'uXRange').min(0.01).max(1).step(0.01).onChange(value => {
//     shaderMaterial.uniforms.uXRange.value = value;
// })
// gui.add(params, 'uZRange').min(0.01).max(1).step(0.01).onChange(value => {
//     shaderMaterial.uniforms.uZRange.value = value;
// })
// gui.add(params, 'uXSpeed').min(0.001).max(0.05).step(0.001).onChange(value => {
//     shaderMaterial.uniforms.uXSpeed.value = value;
// })
// gui.add(params, 'uZSpeed').min(0.001).max(0.05).step(0.001).onChange(value => {
//     shaderMaterial.uniforms.uZSpeed.value = value;
// })
gui.add(params, 'uNoiseFrequency').min(1).max(50).step(1).onChange(value => {
    shaderMaterial.uniforms.uNoiseFrequency.value = value;
})
gui.add(params, 'uNoiseSpeed').min(0.001).max(0.02).step(0.001).onChange(value => {
    shaderMaterial.uniforms.uNoiseSpeed.value = value;
})
gui.add(params, 'uNoiseRange').min(0.1).max(10).step(0.01).onChange(value => {
    shaderMaterial.uniforms.uNoiseRange.value = value;
})
gui.add(params, 'uRange').min(0.01).max(1).step(0.01).onChange(value => {
    shaderMaterial.uniforms.uRange.value = value;
})
gui.add(params, 'uOpacity').min(0.01).max(1).step(0.01).onChange(value => {
    shaderMaterial.uniforms.uOpacity.value = value;
})
gui.addColor(params, 'uHighColor').onChange(value => {
    shaderMaterial.uniforms.uHighColor.value = new THREE.Color(value);
})
gui.addColor(params, 'uLowColor').onChange(value => {
    shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value);
})


window.addEventListener('resize', resizeChange, false);
function resizeChange(){
    const canvas = renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const needResize = canvas.width !== width || canvas.height !== height
    if(needResize){
        renderer.setSize(width, height, false);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

