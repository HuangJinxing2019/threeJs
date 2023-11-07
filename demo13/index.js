import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { CSS2DObject, CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer";

let width = window.innerWidth;
let height = window.innerHeight;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, false);
document.body.append(renderer.domElement);

// 创建css2D 渲染函数
const css2DRenderer = new CSS2DRenderer();
css2DRenderer.setSize(width, height);
css2DRenderer.domElement.style.position = 'fixed';
css2DRenderer.domElement.style.left = '0';
css2DRenderer.domElement.style.top = '0';
css2DRenderer.domElement.style.zIndex = 10;
document.body.append(css2DRenderer.domElement);


const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = -10
const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.z = 20;
scene.add(directionalLight);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const orbitControls = new OrbitControls(camera, css2DRenderer.domElement);
orbitControls.enableDamping = true;

// 创建地球
const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: new THREE.TextureLoader().load(new URL('./textures/earth_atmos_2048.jpg', import.meta.url).href),
    specularMap: new THREE.TextureLoader().load(new URL('./textures/earth_specular_2048.jpg', import.meta.url).href),
    normalMap: new THREE.TextureLoader().load(new URL('./textures/earth_normal_2048.jpg', import.meta.url).href),
    normalScale: new THREE.Vector2(0.85, 0.85),
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth)
// 创建地球html元素
const earthDom = document.createElement('div');
earthDom.innerText = '地球'
earthDom.style.color = '#fff';
earthDom.style.fontSize = '20px';
const earthLabel = new CSS2DObject(earthDom);
earthLabel.position.y = 1.2;
earth.add(earthLabel);

// 标记中国
const chinaDiv = document.createElement('div')
chinaDiv.className = 'chinaLabel'
chinaDiv.innerText = '中国';
chinaDiv.style.fontSize = '16px';
chinaDiv.style.color = '#fff'
const chinaLabel = new CSS2DObject(chinaDiv);
chinaLabel.position.set(-0.3,0.53,-0.9);
earth.add(chinaLabel)

// 创建光线折射，检查中国是否在光线折射范围内
const raycaster = new THREE.Raycaster();


// 创建月球
const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const moonMaterial1 = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: new THREE.TextureLoader().load(new URL('./textures/moon_1024.jpg', import.meta.url).href),
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial1);
moon.position.x = 5
scene.add(moon)
// 创建地球html元素
const moonDom = document.createElement('div');
moonDom.innerText = '月球'
moonDom.style.color = '#fff';
moonDom.style.fontSize = '14px';
const moonLabel = new CSS2DObject(moonDom);
moonLabel.position.y = 0.6;
moon.add(moonLabel);


function  animate(time){
    time = time / 1000;
    requestAnimationFrame(animate);
    moon.position.set(Math.sin(time) * 5, 0, Math.cos(time) * 5)

    // 克隆中国元素的当前坐标
    const chinaPosition = chinaLabel.position.clone();
    // 计算元素到相机的距离
    const labelDistance = chinaPosition.distanceTo(camera.position);
    // 向量(坐标)从世界空间投影到相机的标准化设备坐标 (NDC) 空间。
    chinaPosition.project(camera)
    // 检测射线的碰撞，元素位置到相机位置
    raycaster.setFromCamera(chinaPosition, camera);
    const intersectObjects = raycaster.intersectObjects(scene.children, true);
    // 如果没有碰撞任何物体则显示
    if(intersectObjects.length === 0){
        chinaLabel.element.classList.add('visible')
    }else {
        // 射线投射点和相交部分之间的距离，第一项是最近的，如果最近的距离小于元素与相机的距离，则表示射线到元素之间是有碰撞的，反之这没有
        const minDistance = intersectObjects[0].distance;
        if(minDistance < labelDistance) {
            chinaLabel.element.classList.remove('visible')
        } else {
            chinaLabel.element.classList.add('visible')
        }
    }

    renderer.render(scene, camera);
    css2DRenderer.render(scene, camera)
}
animate()

window.addEventListener('resize', resizeChange, false)

function resizeChange(){
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    renderer.setSize(width, height, false)
    css2DRenderer.setSize(width, height)
    camera.updateProjectionMatrix()
}





