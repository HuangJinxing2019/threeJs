import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";

// 创建一个renderer
const renderer = new THREE.WebGLRenderer();
// 设置画布的大小
renderer.setSize(window.innerWidth, window.innerHeight, false);
// 在body添加canvas画布
document.body.appendChild(renderer.domElement);

// 创建一个透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.z = 20

// 创建一个场景
const scene = new THREE.Scene();

// 添加轨道控制器
const orbitControls = new OrbitControls(camera, renderer.domElement);
// 启用阻尼，让鼠标动作有点惯性效果，不显得那么的生硬。
orbitControls.enableDamping = true;

// 创建一个几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const basicMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
const redMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' })
let cubeArr = [];
// 创建1000个立方体
for(let i =  -5; i < 5; i ++){
    for (let j = -5; j < 5; j ++){
        for (let k = -5; k < 5; k ++){
            const cube = new THREE.Mesh(geometry, basicMaterial);
            cube.position.set(i, j, k)
            scene.add(cube)
            cubeArr.push(cube)
        }
    }
}

// 创建光线投射对象
let raycaster = new THREE.Raycaster();
// 创建存储鼠标坐标对象
let pointer = new THREE.Vector2();
// 鼠标移动事件函数，获取鼠标在场景中的坐标位置
function mousemoveChange(event){
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera);
    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(cubeArr);
    intersects.forEach(item => {
        item.object.material = redMaterial
    })
}
// 监听鼠标移动事件
window.addEventListener('mousemove', mousemoveChange, false);


function animate(){
    requestAnimationFrame(animate)
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

