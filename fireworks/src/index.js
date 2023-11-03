import  * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { RGBELoader } from "three/addons/loaders/RGBELoader";
import FlyLight from "./utils/FlyLight";
import Fireworks from "./utils/Fireworks";

const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.1;

const fireworksArr = [];

document.body.append(renderer.domElement);
const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);
camera.position.z = 15
// camera.position.y = -0.8
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
        y: Math.random() * 15 + 3,
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

