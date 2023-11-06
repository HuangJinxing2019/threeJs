import  * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer";
import { RenderPass } from "three/addons/postprocessing/RenderPass";
import { DotScreenPass } from "three/addons/postprocessing/DotScreenPass";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass";

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
// const glitchPass = new GlitchPass();
// effectComposer.addPass(glitchPass);

const colorParams = {
    r: 0,
    g: 0,
    b: 0,
}

const shaderPass = new ShaderPass({
    uniforms: {
        tDiffuse: {
            value: null,
        },
        uColor: {
            value: new THREE.Color(colorParams.r, colorParams.g, colorParams.b)
        }
    },
    vertexShader: `
        varying vec2 vUv;
        void main(){
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform vec3 uColor;
        void main(){
            vec4 color = texture2D(tDiffuse,vUv);
            color.xyz += uColor;
            gl_FragColor = color;
        }
    `
})
effectComposer.addPass(shaderPass)

// 自定义着色器通道添加法法线纹理
const normalTexture = new THREE.TextureLoader().load(new URL('./textures/interfaceNormalMap.png', import.meta.url).href);
const techPass = new ShaderPass({
    uniforms: {
        uTime: {
            value: 0
        },
        tDiffuse: {
            value: null
        },
        uNormalMap: {
            value: null,
        },
    },
    vertexShader: `
        varying vec2 vUv;
        void main (){
            vUv = uv;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform sampler2D uNormalMap;
        uniform float uTime;
        void main(){
            vec2 newUv = vUv;
            newUv += sin(newUv.x * 10.0 + uTime * 2.0) * 0.02;
            vec4 color = texture2D(tDiffuse, newUv);
            vec4 normalColor = texture2D(uNormalMap, newUv);
            // 设置光线的角度
            vec3 lightDirection = normalize(vec3(-8, 5, 1));
            float lightness = clamp(dot(normalColor.xyz, lightDirection), 0.0, 1.0);
            color.xyz += lightness;
            gl_FragColor = color;
        }
    `
})
techPass.uniforms.uNormalMap.value = normalTexture;
effectComposer.addPass(techPass)



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


gui.add(colorParams,'r').min(-1).max(1).step(0.1).onChange((value) => {
    shaderPass.uniforms.uColor.value = new THREE.Color(colorParams.r, colorParams.g, colorParams.b)
})
gui.add(colorParams,'g').min(-1).max(1).step(0.1).onChange((value) => {
    shaderPass.uniforms.uColor.value = new THREE.Color(colorParams.r, colorParams.g, colorParams.b)
})
gui.add(colorParams,'b').min(-1).max(1).step(0.1).onChange((value) => {
    shaderPass.uniforms.uColor.value = new THREE.Color(colorParams.r, colorParams.g, colorParams.b)
})


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
scene.add(directionalLight);

function animate(time) {
    requestAnimationFrame(animate)
    techPass.uniforms.uTime.value = time / 1000;
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

