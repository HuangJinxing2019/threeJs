import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";
import vertexShaderSource from './shaders/vertex.glsl?raw';
import fragmentShaderSource from './shaders/fragment.glsl?raw';

// 创建一个renderer
const renderer = new THREE.WebGLRenderer();
// 设置画布的大小
renderer.setSize(window.innerWidth, window.innerHeight, false);
// 在body添加canvas画布
document.body.appendChild(renderer.domElement);

// 创建一个透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 5);

// 创建一个场景
const scene = new THREE.Scene();
// 创建一个几何体
const planeGeometry = new THREE.PlaneGeometry(2, 2, 200, 200)

// 使用着色器创建材质
let shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: {
            value: 0,
        }
    },
});

const plan = new THREE.Mesh(planeGeometry, shaderMaterial);
// 将物体添加至场景中
scene.add(plan)






// 添加坐标轴参考线
const axesHelper = new THREE.AxesHelper(5)
axesHelper.material.depthTest = false;
axesHelper.renderOrder = 1;
scene.add(axesHelper);

// 添加轨道控制器
const orbitControls = new OrbitControls(camera, renderer.domElement);
// 启用阻尼，让鼠标动作有点惯性效果，不显得那么的生硬。
orbitControls.enableDamping = true;


let clock = new THREE.Clock();
// 创建时钟对象
function animate(){
    const time = clock.getElapsedTime()
    requestAnimationFrame(animate)
    shaderMaterial.uniforms.uTime.value = time;
    renderer.render(scene, camera);
}

animate()

// 监听窗口变化
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

