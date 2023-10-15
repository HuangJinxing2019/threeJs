import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";
import {BufferGeometry} from "three";

const width = window.innerWidth;
const height = window.innerHeight;

// 创建渲染函数
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1 , 1000);
// 设置相机位置
camera.position.z = 5;

// 创建轨道控制器
let orbitControls = new OrbitControls(camera, renderer.domElement);
// 启用阻尼
orbitControls.enableDamping = true;

// 创建场景
const scene = new THREE.Scene();

// 创建坐标参考系
let axesHelper = new THREE.AxesHelper(5);
axesHelper.material.depthTest = false;
axesHelper.renderOrder = 1
scene.add(axesHelper);

// 创建一个球体
let sphereGeometry = new THREE.SphereGeometry(2, 30, 30);
let bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute('position', sphereGeometry.attributes.position);
// 创建点材质
let material = new THREE.PointsMaterial({color: '#ff0000', size: 0.5});
// 加载图形纹理贴图
let textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load(new URL('../assets/particles/9.png', import.meta.url).href)
// 使用纹理贴图
material.map = texture;
material.alphaMap = texture;
material.transparent = true;
material.depthWrite = false;
material.blending = THREE.AdditiveBlending;
// 创建一个网格物体
let points = new THREE.Points(bufferGeometry, material);
scene.add(points);

// 灯光
// 环境光
let ambient  = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
let pointLight = new THREE.PointLight(0xffffff, 1);

function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()


