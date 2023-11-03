import  * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { RGBELoader } from "three/addons/loaders/RGBELoader";
import FlyLight from "./utils/FlyLight";
import Fireworks from "./utils/Fireworks";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import * as dat from "dat.gui";
import { Water } from "three/addons/objects/Water2";

const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.1;

const fireworksArr = [];

document.body.append(renderer.domElement);
const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);
camera.position.set(30, 10, -15.7)
// camera.rotation.set(-1.7, 0.92, -2.4)
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
new RGBELoader().loadAsync(new URL('./assets/textures/2k.hdr', import.meta.url).href).then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
})

const scene = new THREE.Scene();


// 创建孔明灯
let flyLight = new FlyLight(scene);
flyLight.create(new URL('./assets/model/flyLight.glb', import.meta.url).href, 200)

// 加载建筑模型
new GLTFLoader().loadAsync(new URL('./assets/model/newyears_min.glb', import.meta.url).href).then(gltf => {
    scene.add(gltf.scene)
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const water = new Water(planeGeometry, {
        scale: 4,
        textureHeight: 1024,
        textureWidth: 1024,
    });
    water.position.y = 1
    water.rotation.x = - Math.PI / 2
    scene.add(water)
})

const ambientLight = new THREE.AmbientLight(0xfffff, 1);
scene.add(ambientLight)


function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    fireworksArr.forEach((fireworks, i) => {
        const clear = fireworks.update()
        if(clear) fireworksArr.splice(i, 1)
    })
}
animate()

window.addEventListener('resize', resizeChange, false);
window.addEventListener('click', sendFireworks, false);
function sendFireworks(){
    // 创建烟花
    let startPosition = {x: 0, y: 0, z: 0 };
    let endPosition = {
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 10 + 10,
        z: (Math.random() - 0.9) * 20,
    };
    const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`;
    let fireworks = new Fireworks({scene, startPosition, endPosition, color, renderer});
    fireworks.send(40.0);
    fireworksArr.push(fireworks);
}


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

const gui = new dat.GUI();
// gui.add(camera.position, 'x')
// gui.add(camera.position, 'y')
// gui.add(camera.position, 'z')
// gui.add(camera.rotation, 'x')
// gui.add(camera.rotation, 'y')
// gui.add(camera.rotation, 'z')

