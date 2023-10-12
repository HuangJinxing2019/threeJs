import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";

const width = window.innerWidth;
const height = window.innerHeight;

// 创建renderer函数
const renderer = new THREE.WebGLRenderer();
// 设置画布大小
renderer.setSize(width, height, false);
// 将画布添加到body中
document.body.appendChild(renderer.domElement);

// 创建相机
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
// 设置相机位置
camera.position.z = 10

// 创建轨道控制器
let orbitControls = new OrbitControls(camera, renderer.domElement);
// 启用阻尼
orbitControls.enableDamping = true;

// 创建场景
let scene = new THREE.Scene();

// 创建坐标辅助线
let axesHelper = new THREE.AxesHelper(5);
axesHelper.material.depthTest = false;
axesHelper.renderOrder = 1;
scene.add(axesHelper)


// 创建立方体
let geometry = new THREE.BoxGeometry(1, 1, 1);
// 创建基础材质
let textureLoader = new THREE.TextureLoader();
// 颜色贴图
let mapUrl = new URL('./assets/textures/color.jpg', import.meta.url).href;
let mapTexture = textureLoader.load(mapUrl);
// 透明度贴图
let alphaTexture = textureLoader.load(new URL('./assets/textures/alpha.jpg', import.meta.url).href);
// 环境遮挡贴图
let aoTexture = textureLoader.load(new URL('./assets/textures/ambientOcclusion.jpg', import.meta.url).href);
// 置换贴图
let displacementTexture = textureLoader.load(new URL('./assets/textures/ambientOcclusion.jpg', import.meta.url).href);
// 粗糙贴图
let roughnessTexture = textureLoader.load(new URL('./assets/textures/roughness.jpg', import.meta.url).href);
// 金属材质
let metalnessTexture = textureLoader.load(new URL('./assets/textures/metalness.jpg', import.meta.url).href);
// 法线贴图
let normalTexture = textureLoader.load(new URL('./assets/textures/normal.jpg', import.meta.url).href);

// 创建网格对象
// let material = new THREE.MeshBasicMaterial({
//     color: '#ffff00',
//     map: mapTexture,
//     transparent: true,
//     alphaMap: alphaTexture,
//     aoMap: aoTexture,
//     aoMapIntensity: 0.5,
// });
let material = new THREE.MeshStandardMaterial({
    color: '#ffff00',
    side: THREE.DoubleSide, // 父级Material公共材质属性。定义渲染那一面。 默认为THREE.FrontSide（前面）。其他选项有THREE.BackSide（背面） 和 THREE.DoubleSide（双面）。
    map: mapTexture,
    transparent: true,
    alphaMap: alphaTexture,
    aoMap: aoTexture,
    aoMapIntensity: 1,
    displacementMap: displacementTexture,
    displacementScale: 0.05,
    roughnessMap: roughnessTexture,
    roughness: 0.5,
    metalnessMap: metalnessTexture,
    metalness: 1,
    normalMap: normalTexture,
});
// 设置第二组uv
geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2))
// 创建网格对象
let mesh = new THREE.Mesh(geometry, material);
// 将材质添加到场景
scene.add(mesh);

// 灯光
// 添加环境光
let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)
// 添加平行光
let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10)
scene.add(directionalLight)

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();





