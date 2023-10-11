import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";

const width = window.innerWidth;
const height = window.innerHeight;

// 创建renderer 函数
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// 创建相机
const camera = new THREE.PerspectiveCamera(150, width / height, 0.1, 1000);
// 设置相机位置
camera.position.z = 3;

// 添加轨道控制器
new OrbitControls(camera, renderer.domElement)

// 创建场景
const scene = new THREE.Scene();

// 添加辅助坐标
const axesHelper = new THREE.AxesHelper(5)
axesHelper.material.depthTest = false;
axesHelper.renderOrder = 1;
scene.add(axesHelper)

// 创建几何体缓冲对象
const geometry = new THREE.BufferGeometry();

// 创建顶点坐标
const vertices = new Float32Array([
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,

    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0, -1.0,  1.0
])
// 创建顶点缓冲对象，并复制给几何体对象。
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

// 创建材质
const basicMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' });
// 创建网格对象
const cube = new THREE.Mesh(geometry, basicMaterial)
// 添加场景
scene.add(cube)
// 渲染
renderer.render(scene, camera)

function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene, camera);
}
animate()

