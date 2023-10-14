import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";
import * as dat from 'dat.gui';

const width = window.innerWidth;
const height = window.innerHeight;

// 创建渲染函数
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// 开启阴影计算
renderer.shadowMap.enabled = true;

// 创建相机
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1 , 1000);
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

// 创建一个球体
let sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
// 创建一个基础网格材质
let material = new THREE.MeshStandardMaterial();
// 创建一个网格物体
let mesh = new THREE.Mesh(sphereGeometry, material);
// 物体启用阴影
mesh.castShadow = true;
scene.add(mesh)
// 添加到场景
// 创建一个平面
let planeGeometry = new THREE.PlaneGeometry(10, 10);
let planeMash = new THREE.Mesh(planeGeometry, material);
// 打开接受阴影
planeMash.receiveShadow = true;

planeMash.rotation.x = - Math.PI / 2
planeMash.position.y = - 1
scene.add(planeMash)

// 灯光
// 环境光
let ambient  = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
// 灯光开启阴影折射
directionalLight.castShadow = true;
// 设置模糊阴影的边缘
directionalLight.shadow.radius = 20;
// 设置阴影贴图的宽度和高度，
directionalLight.shadow.mapSize.set(2048, 2048)
// 设置光投射相机的属性
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
// 仅平行光有效
directionalLight.shadow.camera.left= -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;

scene.add(directionalLight)



const gui = new dat.GUI();
gui.add(directionalLight.shadow, 'radius').min(0).max(30).step(1).name('radius：模糊度边缘')
gui.add(directionalLight.shadow.camera, 'near').min(0.01).max(1).step(0.01).name('near：光照相机近面').onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix()
})
gui.add(directionalLight.shadow.camera, 'far').min(5).max(1000).step(5).name('far：光照相机远面').onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix()
})
gui.add(directionalLight.shadow.camera, 'left').min(-5).max(5).step(1).name('left：光照相机远面').onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix()
})
gui.add(directionalLight.shadow.camera, 'right').min(-5).max(5).step(1).name('right：光照相机远面').onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix()
})

function animate(){
    requestAnimationFrame(animate)
    camera.updateProjectionMatrix()
    renderer.render(scene, camera)
}

animate()


