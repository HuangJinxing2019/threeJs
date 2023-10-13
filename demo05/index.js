import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { RGBELoader } from "three/addons/loaders/RGBELoader";

const oProgress = document.querySelector('.progress');

const width = window.innerWidth;
const height = window.innerHeight;
// 创建渲染函数
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// 创建相机
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 10;

// 创建轨道控制器
let orbitControls = new OrbitControls(camera, renderer.domElement);
// 启用阻尼
orbitControls.enableDamping = true

// 创建场景
let scene = new THREE.Scene();

// 创建坐标参考线
let axesHelper = new THREE.AxesHelper(5);
axesHelper.material.depthTest = false;
axesHelper.renderOrder = 1;
scene.add(axesHelper);

// // 加载环境贴图
// let cubeTextureLoader = new THREE.CubeTextureLoader();
// let envTexture = cubeTextureLoader.load([
//     new URL('./assets/textures/px.jpg', import.meta.url).href,
//     new URL('./assets/textures/nx.jpg', import.meta.url).href,
//     new URL('./assets/textures/py.jpg', import.meta.url).href,
//     new URL('./assets/textures/ny.jpg', import.meta.url).href,
//     new URL('./assets/textures/pz.jpg', import.meta.url).href,
//     new URL('./assets/textures/nz.jpg', import.meta.url).href,
// ]);
// 加载.hdr环境贴图
let rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync(new URL('./assets/textures/hdr/003.hdr', import.meta.url).href, ({total, loaded}) => {
    let value = (loaded / total * 100).toFixed(2) + '%'
    oProgress.innerHTML = `加载中${value}`
}).then(texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping ;
    scene.background = texture;
    scene.environment = texture;
    oProgress.innerHTML = ``
})

// // 加载环境贴图
// let textureLoader = new THREE.TextureLoader();
// let envTexture = textureLoader.load(new URL('./assets/textures/012.jpg', import.meta.url).href);
// envTexture.mapping = THREE.EquirectangularReflectionMapping
// envTexture.encoding  = THREE.sRGBEncoding

// 创建一个球体
let sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
// 创建标准材质
let meshStandardMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.1, // 粗糙度
    metalness: 1, // 金属度
    // envMap: envTexture,
});
let mesh = new THREE.Mesh(sphereGeometry, meshStandardMaterial);
scene.add(mesh)

// // 给场景设置背景图
// scene.background = envTexture;
// // 给场景所有物体添加默认贴图
// scene.environment = envTexture;


// 创建灯光
// 环境光
let ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// 创建平行光
let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10)
scene.add(directionalLight)

// 开始绘画
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate()



