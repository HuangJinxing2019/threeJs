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
let ambient  = new THREE.AmbientLight(0xffffff, 0.1);
// scene.add(ambient);
let pointLight = new THREE.PointLight(0xff0000, 10);
pointLight.position.set(0, 0, 0);

// 创建一个小球
let ballGeometry = new THREE.SphereGeometry(0.1, 10, 10);
let meshBasicMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' });
const smallBall = new THREE.Mesh(ballGeometry, meshBasicMaterial)
smallBall.add(pointLight)
smallBall.position.set(2, 2, 2)
scene.add(smallBall)


// 灯光开启阴影折射
pointLight.castShadow = true;
// 设置模糊阴影的边缘
pointLight.shadow.radius = 20;
// 设置阴影贴图的宽度和高度，
pointLight.shadow.mapSize.set(2048, 2048)

// scene.add(pointLight)

const gui = new dat.GUI();
gui.add(pointLight.shadow, 'radius').min(0).max(30).step(1).name('radius：模糊度边缘')
gui.add(pointLight, 'intensity').min(0).max(30).step(1).name('intensity：光照强度')
gui.add(pointLight, 'distance').min(0).max(1000).step(1).name('distance：衰减定律')
gui.add(pointLight, 'decay').min(0).max(5).step(0.01).name('decay：光强度的距离衰减')


function animate(time){
    smallBall.position.x = Math.sin(time / 1000 || 0) * 3;
    smallBall.position.z = Math.cos(time / 1000 || 0) * 3;
    requestAnimationFrame(animate)
    camera.updateProjectionMatrix()
    renderer.render(scene, camera)
}

animate()