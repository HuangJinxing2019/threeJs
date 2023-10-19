import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";
import * as CANNON from 'cannon-es';
import {cloneUniforms} from "three/src/renderers/shaders/UniformsUtils";

// 创建一个renderer
const renderer = new THREE.WebGLRenderer();
// 设置画布的大小
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.shadowMap.enabled = true;
// 在body添加canvas画布
document.body.appendChild(renderer.domElement);

// 创建一个透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 20);
camera.castShadow = true;

// 添加轨道控制器
const orbitControls = new OrbitControls(camera, renderer.domElement);
// 启用阻尼，让鼠标动作有点惯性效果，不显得那么的生硬。
orbitControls.enableDamping = true;

// 创建一个场景
const scene = new THREE.Scene();

// 添加坐标轴参考线
const axesHelper = new THREE.AxesHelper(5)
axesHelper.material.depthTest = false;
axesHelper.renderOrder = 1;
scene.add(axesHelper);

// 创建一个几何体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)

// 创建材质
const standardMaterial = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(sphereGeometry, standardMaterial);
cube.castShadow = true
// 将物体添加至场景中
scene.add(cube)

let planeGeometry = new THREE.PlaneGeometry(20, 20);
const plan = new THREE.Mesh(planeGeometry, standardMaterial);
plan.receiveShadow = true
plan.rotation.x = - Math.PI / 2
plan.position.y = -5
scene.add(plan)

// 灯光
// 环境光
let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 5, 0)
directionalLight.castShadow = true;
scene.add(directionalLight)

// 创建物理世界
const world = new CANNON.World();
// 设置引力
world.gravity.set(0, -9.8, 0);
// 创建物理世界物体形状
let worldSphere = new CANNON.Sphere(1);
// 创建物理世界物体材质
let worldMaterial = new CANNON.Material();
// 创建物理世界的物体
const wordBody = new CANNON.Body({
    shape: worldSphere,
    material: worldMaterial,
    // 设置小球的位置
    position: new CANNON.Vec3(0, 0, 0),
    // 小球质量
    mass: 1,
});
// 将物体添加到物理世界
world.addBody(wordBody)

// 创建平面
const worldPlan = new CANNON.Plane()
const worldPlanMaterial = new CANNON.Material()
const worldPlanBody = new CANNON.Body({
    shape: worldPlan,
    mass: 0,
    position: new CANNON.Vec3(0, -5, 0),
    material: worldPlanMaterial
})
// 绕X轴坐标选装-90°
worldPlanBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), - Math.PI / 2)
world.addBody(worldPlanBody);

// 设置两种材质发生碰撞时发生的效果。
const contactMaterial = new CANNON.ContactMaterial(
    worldMaterial,
    worldPlanMaterial,
    {
        // 摩擦力
        friction: 0.1,
        // 弹性
        restitution: 0.7
    });
world.addContactMaterial(contactMaterial);

// 给物理世界的物体（球体）添加碰撞处理函数
wordBody.addEventListener('collide', collideChange, false)
function collideChange(e){
    // 获取音频
    const hitSound = new Audio(new URL('../assets/metalHit.mp3', import.meta.url).href)
    // 获取碰撞的强度
    const impactStrength = e.contact.getImpactVelocityAlongNormal();
    if(impactStrength > 1){
        // 播放进度重置为0开始
        hitSound.currentTime = 0
        hitSound.play();
    }
    console.log(e)
}

// 给球体施加一个力
wordBody.applyLocalForce(
    new CANNON.Vec3(100, 0, 0), // 力的大小和方向
    new CANNON.Vec3(0, 0, 0), // 受力点
)

const clock = new THREE.Clock();
function animate(){
    const time = clock.getDelta();
    world.step(1 / 60, time)
    cube.position.copy(wordBody.position)
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

