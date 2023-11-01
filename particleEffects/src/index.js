import  * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls";
import VERTEX_SOURCE from './shader/vertex.glsl?raw';
import FRAGMENT_SOURCE from './shader/gragment.glsl?raw';
import {BufferAttribute} from "three";

const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.2;

document.body.append(renderer.domElement);
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 10
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(5);
axesHelper.material.depthTest = false;
axesHelper.renderOrder = 1;
scene.add(axesHelper);


// 加载纹理
const textureLoader = new THREE.TextureLoader();
const texture1 = textureLoader.load(new URL('./textures/images/1.png', import.meta.url).href);
const texture2 = textureLoader.load(new URL('./textures/images/3.png', import.meta.url).href);
const texture3 = textureLoader.load(new URL('./textures/images/9.png', import.meta.url).href);

let params = {
    count: 10000,
    radius: 5,
    branch: 4,
    rotateScale: 0.3,
    color: '#ff6030',
    endColor: '#1b3984'
}

const galaxyColor = new THREE.Color(params.color);
let outColor = new THREE.Color(params.endColor);

const bufferGeometry = new THREE.BufferGeometry();
const bufferPoint = new Float32Array(params.count * 3)
const imageIndex = new Float32Array(params.count);
const scales = new Float32Array(params.count);
const colors = new Float32Array(params.count * 3)
for(let i = 0; i < params.count; i++){
    const angle = Math.PI * 2 / params.branch * (i % params.branch);
    const current = i * 3;
    const radius = Math.random() * params.radius;
    const randomX =
        Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;
    const randomY =
        Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;
    const randomZ =
        Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;

    bufferPoint[current] = Math.cos(angle) * radius + randomX;
    bufferPoint[current + 1] = randomY;
    bufferPoint[current + 2] = Math.sin(angle) * radius + randomZ;
    const mixColor = galaxyColor.clone();
    mixColor.lerp(outColor, radius / params.radius);
    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;
    imageIndex[current] = i % 3;
    scales[current] = Math.random();
}
bufferGeometry.setAttribute('position', new BufferAttribute(bufferPoint, 3))
bufferGeometry.setAttribute('imgIndex', new BufferAttribute(imageIndex, 1))
bufferGeometry.setAttribute('color', new BufferAttribute(colors, 3))
bufferGeometry.setAttribute('scale', new BufferAttribute(scales, 3))

const shader = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SOURCE,
    fragmentShader: FRAGMENT_SOURCE,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
        uTexture1: {
            value: texture1,
        },
        uTexture2: {
            value: texture2,
        },
        uTexture3:{
            value: texture3,
        },
        uTime: {
            value: 0,
        }
    }
})
const point = new THREE.Points(bufferGeometry, shader)
scene.add(point);

function animate(time) {
    requestAnimationFrame(animate)
    shader.uniforms.uTime.value = time / 1000;
    renderer.render(scene, camera)
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

