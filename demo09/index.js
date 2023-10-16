import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls";
import {gsap} from "gsap";
import './index.css';
import index from "dat.gui";
import {BufferAttribute} from "three";

let width = window.innerWidth,
    height = window.innerHeight,
    currentPage = 0,
    renderer = null,
    camera = null,
    scene = null,
    rayCubeArr = [],
    groupArr = [],
    animationArr = [];

// 初始化函数，创建场景、渲染函数、相机
function init() {
    // 创建一个renderer
    renderer = new THREE.WebGLRenderer({alpha: true});
    // 设置画布的大小
    renderer.setSize(width, height, false);
    // 在body添加canvas画布
    document.body.appendChild(renderer.domElement);
    // 创建一个透视相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    // 设置相机位置
    camera.position.z = 18;
    // 创建一个场景
    scene = new THREE.Scene();
    const raycaster = createRaycaster();
    const triangle = createTriangle();
    const pointLight = createPointLight();
    triangle.position.y = -30;
    pointLight.position.y = -60;
    groupArr.push(raycaster, triangle, pointLight)
    scene.add(raycaster);
    scene.add(triangle);
    scene.add(pointLight);
}

function addEventListener() {
    window.addEventListener('resize', resizeChange, false);
    window.addEventListener('scroll', scrollChange, false);
    window.addEventListener('mousemove', mousemoveChange, false);
}

function createRaycaster() {
    let group = new THREE.Group();
    // 创建一个几何体
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    // 创建材质
    const basicMaterial = new THREE.MeshBasicMaterial({wireframe: true})
    // 创建1000个立方体
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            for (let k = 0; k < 5; k++) {
                const cube = new THREE.Mesh(geometry, basicMaterial);
                cube.position.set(i * 2 - 4, j * 2 - 4, k * 2 - 4)
                group.add(cube)
                rayCubeArr.push(cube)
            }
        }
    }
    return group;
}

function createTriangle() {
    const group = new THREE.Group();
    for (let i = 0; i < 50; i++) {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(9);
        const basicMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.5, side: THREE.DoubleSide});
        for (let j = 0; j < 9; j++) {
            vertices[j] = Math.random() * 10 - 5;
        }
        geometry.setAttribute('position', new BufferAttribute(vertices, 3));
        basicMaterial.color.setRGB(Math.random(), Math.random(), Math.random());
        const cube = new THREE.Mesh(geometry, basicMaterial);
        group.add(cube)
    }
    return group;
}
function createPointLight(){
    const group = new THREE.Group();
    // 创建一个球体
    let sphereGeometry = new THREE.SphereGeometry(1.5, 20, 20);
    // 创建一个基础网格材质
    let material = new THREE.MeshStandardMaterial();
    // 创建一个网格物体
    let mesh = new THREE.Mesh(sphereGeometry, material);
    group.add(mesh)
    let planeGeometry = new THREE.PlaneGeometry(30, 20);
    let planeMash = new THREE.Mesh(planeGeometry, material);
    // 打开接受阴影
    planeMash.receiveShadow = true;

    planeMash.rotation.x = - Math.PI / 2
    planeMash.position.y = - 1.5
    group.add(planeMash)
    let pointLight = new THREE.PointLight(0xff0000, 10);
    pointLight.position.set(0, 0, 0);

    // 创建一个小球
    let ballGeometry = new THREE.SphereGeometry(0.5, 10, 10);
    let meshBasicMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' });
    const smallBall = new THREE.Mesh(ballGeometry, meshBasicMaterial)
    smallBall.add(pointLight)
    smallBall.position.set(2, 2, -2)
    group.add(smallBall)
    // 灯光开启阴影折射
    pointLight.castShadow = true;
    // 设置模糊阴影的边缘
    pointLight.shadow.radius = 20;
    // 设置阴影贴图的宽度和高度，
    pointLight.shadow.mapSize.set(2048, 2048)
    gsap.to(smallBall.position, {
        x: -3,
        duration: 6,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
    });
    gsap.to(smallBall.position, {
        y: 0,
        duration: 0.5,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
    });
    return group;
}

function resizeChange() {
    const canvas = renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}
function scrollChange(event) {
    const scrollY = window.scrollY;
    const page = Math.round(scrollY / height)
    if (page !== currentPage) {
        currentPage = page;
        scrollAnimation(currentPage);
        console.log(`滚到第${currentPage}页`)
    }
    camera.position.y = -scrollY / height * 30;
}

// 创建光线投射对象
let raycaster = new THREE.Raycaster();
// 创建存储鼠标坐标对象
let pointer = new THREE.Vector2();
const redMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' })
function mousemoveChange(event){
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera);
    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(rayCubeArr);
    intersects.forEach(item => {
        item.object.material = redMaterial
    })
}

function scrollAnimation(index) {
    if (index !== 2) {
        animationArr[index].pause();
        gsap.to(
            groupArr[currentPage].rotation,
            {
                x: '+=' + Math.PI * 2,
                y: '+=' + Math.PI * 2,
                duration: 2,
                ease: 'slow(0.7,0.7,false)',
                onComplete: () => {
                    animationArr[index].play();
                }
            }
        )
        animationArr[index].pause();
    }else {
        gsap.to(groupArr[index].rotation, { x: '+=' + Math.PI * 2, z: '+=' + Math.PI * 2, duration: 2 })
    }
}


function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function createAnimation() {
    groupArr.forEach((item, index) => {
        if (index !== 2) {
            let tween = gsap.to(item.rotation, {
                x: '+=' + Math.PI * 2,
                y: '+=' + Math.PI * 2,
                duration: 20,
                repeat: -1,
                ease: 'none'
            });
            animationArr.push(tween)
        }
    })
}

init();
render();
createAnimation();
addEventListener();



