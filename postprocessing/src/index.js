import  * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer";
import { RenderPass } from "three/addons/postprocessing/RenderPass";
import { DotScreenPass } from "three/addons/postprocessing/DotScreenPass";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass";

import dat from 'dat.gui';

const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, false);
renderer.shadowMap.enabled = true;
document.body.append(renderer.domElement);

// 实例化合成效果
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(width, height)


const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

const scene = new THREE.Scene();

// 添加合成通道
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass)

// 添加点效果
const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass)

// 抗锯齿效果
const smaaPass = new SMAAPass();
effectComposer.addPass(smaaPass);

// 故障效果
const glitchPass = new GlitchPass();
effectComposer.addPass(glitchPass);

// 发光效果
const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.strength = 1;
unrealBloomPass.radius = 0;
unrealBloomPass.threshold = 1;
effectComposer.addPass(unrealBloomPass)

const gui = new dat.GUI();

gui.add(unrealBloomPass,'strength').min(0).max(2).step(0.01)
gui.add(unrealBloomPass,'radius').min(0).max(2).step(0.01)
gui.add(unrealBloomPass,'threshold').min(0).max(2).step(0.01)

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

// 添加环境纹理
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
    new URL('./textures/px.jpg', import.meta.url).href,
    new URL('./textures/nx.jpg', import.meta.url).href,
    new URL('./textures/py.jpg', import.meta.url).href,
    new URL('./textures/ny.jpg', import.meta.url).href,
    new URL('./textures/pz.jpg', import.meta.url).href,
    new URL('./textures/nz.jpg', import.meta.url).href
]);
scene.background = envMapTexture;

// 加载模型
new GLTFLoader().load(new URL('./models/damagedHelmet.gltf', import.meta.url).href, function (gltf){
    scene.add(gltf.scene)
})

// 添加灯光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.z = 200;
directionalLight.castShadow = true;
scene.add(directionalLight)

function animate(time) {
    requestAnimationFrame(animate)
    effectComposer.render()
}
animate()

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

