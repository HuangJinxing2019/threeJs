import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";
import {BufferAttribute, BufferGeometry} from "three";
import * as dat from "dat.gui";

const width = window.innerWidth;
const height = window.innerHeight;

// 创建渲染函数
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// 创建相机
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1 , 80);
// 设置相机位置
camera.position.z = 100;

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

/**
 * @param count 顶点数量
 * @param scope x、y、z坐标的边界值
 * @returns {BufferAttribute}
 */
function createPosition(count, scope){
    let vertices = new Float32Array(count * 3);
    let colors = new Float32Array(count * 3);
    for(let i = 0; i < count * 3; i ++){
        vertices[i] = Math.random() * scope * 2 - scope;
        colors[i] = Math.random();
    }
    return [new THREE.BufferAttribute(vertices, 3), new THREE.BufferAttribute(colors, 3)]
}
/**
 *
 * @param position 顶点坐标
 * @param colors 顶点颜色
 * @param textureUrl 纹理贴图
 * @returns {Points}
 */
function createPoint(position, colors, textureUrl){
    let bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', position);
    colors && bufferGeometry.setAttribute('color', colors)
    // 创建点材质
    let material = new THREE.PointsMaterial({ size: 1 });
    // 加载图形纹理贴图
    if(textureUrl){
        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load(textureUrl)
        // 使用纹理贴图
        material.map = texture;
        material.alphaMap = texture;
    }
    material.transparent = true;
    material.depthWrite = false;
    material.blending = THREE.AdditiveBlending;
    // 开启顶点颜色
    material.vertexColors = true;
    // 创建一个网格物体
    return new THREE.Points(bufferGeometry, material);
}

const [position1, colors1] = createPosition(10000, 100);
const [position2, colors2] = createPosition(10000, 100);
let point1 = createPoint(position1, colors1, new URL('../assets/particles/14.png',import.meta.url).href);
let point2 = createPoint(position2, colors2, new URL('../assets/particles/1.png',import.meta.url).href);
scene.add(point1);
scene.add(point2);

// 灯光
// 环境光
let ambient  = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);


const gui = new dat.GUI();
gui.add(camera.position, 'z').min(5).max(100).step(1).name('相机Z轴坐标').onChange(() => {
    camera.updateProjectionMatrix()
})
gui.add(camera, 'near').min(0.1).max(1).step(0.01).name('相机near').onChange(() => {
    camera.updateProjectionMatrix()
})
gui.add(camera, 'far').min(10).max(500).step(2).name('相机far').onChange(() => {
    camera.updateProjectionMatrix()
})

function animate(time = 0){
    requestAnimationFrame(animate)
    point1.rotation.x = time / 1000 * 0.1
    point1.rotation.y = time / 1000 * 0.05
    point2.rotation.x = time / 1000 * 0.3
    point2.rotation.y = time / 1000 * 0.04
    renderer.render(scene, camera)
}

animate()


