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
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1 , 500);
// 设置相机位置
camera.position.z = 10;

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

let params = {
    count: 10000,
    radius: 5,
    branch: 3,
    rotateScale: 0.3,
    color: '#ff6030',
    endColor: '#1b3984'
}
/**
 * 创建顶点坐标
 * @param params
 * @returns {BufferAttribute}
 */
function createPosition(params){
    let vertices = new Float32Array(params.count * 3);
    let colors = new Float32Array(params.count * 3);
    const centerColor = new THREE.Color(params.color);
    const endColor = new THREE.Color(params.endColor);
    for(let i = 0; i < params.count; i++){
        const current = i * 3;
        // 当前点应该在那条分支上
        const branchAngel = (i % params.branch) * (Math.PI * 2 / params.branch)
        // 当前点距离圆心的距离
        const radius = Math.random() * params.radius * Math.pow(Math.random(), 3)

        const randomX = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - radius) / params.radius;
        const randomY = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - radius) / params.radius;
        const randomZ = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - radius) / params.radius;

        vertices[current] = Math.cos(branchAngel + radius * params.rotateScale) * radius + randomX;
        vertices[current + 1] = randomY;
        vertices[current + 2] = Math.sin(branchAngel + radius * params.rotateScale) * radius + randomZ;

        // 混合颜色，形成渐变色
        const mixColor = centerColor.clone();
        // 设置收敛的颜色
        mixColor.lerp(endColor, radius / params.radius)
        colors[current] = mixColor.r
        colors[current + 1] = mixColor.g
        colors[current + 2] = mixColor.b
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
    bufferGeometry.setAttribute('color', colors);
    // 创建点材质
    let material = new THREE.PointsMaterial({ size: 0.2 });
    // 加载图形纹理贴图
    if(textureUrl) {
        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load(textureUrl)
        // 使用纹理贴图
        material.map = texture;
        material.alphaMap = texture;
    }
    material.transparent = true;
    material.depthWrite = false;
    material.blending = THREE.AdditiveBlending;

    // 开启顶点着色器
    material.vertexColors = true;
    // 创建一个网格物体
    return new THREE.Points(bufferGeometry, material);
}

const [position, colors] = createPosition(params);
let point = createPoint(position, colors, new URL('../assets/particles/1.png',import.meta.url).href);
scene.add(point);

// 灯光
// 环境光
let ambient  = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

function animate(time = 0){
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()


