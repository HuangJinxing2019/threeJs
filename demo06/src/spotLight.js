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
let spotLight = new THREE.SpotLight(0xffffff, 10);
spotLight.position.set(5, 5, 5);

// 灯光开启阴影折射
spotLight.castShadow = true;
// 设置模糊阴影的边缘
spotLight.shadow.radius = 20;
// 设置阴影贴图的宽度和高度，
spotLight.shadow.mapSize.set(2048, 2048)

spotLight.angle = Math.PI / 6
spotLight.distance = 0
spotLight.penumbra = 0
spotLight.decay = 2;


// 设置光投射相机的属性
spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 500;
// 好像没什么用处
// spotLight.shadow.camera.fov = 0;

scene.add(spotLight)
const gui = new dat.GUI();
gui.add(spotLight.shadow, 'radius').min(0).max(30).step(1).name('radius：模糊度边缘')
gui.add(spotLight, 'intensity').min(0).max(30).step(1).name('intensity：光照强度')
gui.add(spotLight, 'angle').min(Math.PI / 9).max(Math.PI / 2).step(0.01).name('angle：光照幅度')
gui.add(spotLight, 'distance').min(0).max(10).step(1).name('distance：衰减定律')
gui.add(spotLight, 'penumbra').min(0).max(1).step(0.01).name('penumbra：光照边缘附近衰减')
gui.add(spotLight, 'decay').min(0).max(5).step(0.01).name('decay：光强度的距离衰减')
// gui.add(spotLight.shadow.camera, 'fov').min(0).max(75).step(0.01).name('fov：角度').onChange(() => {
//     spotLight.shadow.camera.updateProjectionMatrix()
// })

function animate(){
    requestAnimationFrame(animate)
    camera.updateProjectionMatrix()
    renderer.render(scene, camera)
}

animate()


