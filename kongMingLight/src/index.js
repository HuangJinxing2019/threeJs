import  * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls";
import VERTEX_SOURCE from './shader/vertex.glsl?raw';
import FRAGMENT_SOURCE from './shader/gragment.glsl?raw';
import { RGBELoader } from "three/addons/loaders/RGBELoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import gsap from 'gsap'

const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.2;

document.body.append(renderer.domElement);
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 2
camera.position.y = -0.8
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
new RGBELoader().loadAsync(new URL('./assets/textures/2k.hdr', import.meta.url).href).then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
})

const scene = new THREE.Scene();

let flyLightBox = null
new GLTFLoader().loadAsync(new URL('./assets/model/flyLight.glb', import.meta.url).href).then((gltf) => {
    flyLightBox = gltf.scene.children[0];
    flyLightBox.material = shader;
    for (let i = 0; i < 200; i++) {
        const flyLight = gltf.scene.clone(true);
        let y = Math.random() * 80 + 15
        let x = (Math.random() - 0.5) * 300
        let z = (Math.random() - 0.5) * 300
        flyLight.position.set(x, y, z)

        gsap.to(flyLight.rotation, {
            y: 2 * Math.PI,
            duration: 5 + Math.random() * 40,
            repeat: -1,
        })
        gsap.to(flyLight.position, {
            x: '+=' + Math.PI + Math.random() * 20,
            y: '+=' + Math.PI + Math.random() * 10,
            duration: 5 + Math.random() * 30,
            yoyo: true,
            repeat: -1,
        })

        scene.add(flyLight)
    }
})
// const box = new THREE.BoxGeometry(2, 2, 2);
const shader = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SOURCE,
    fragmentShader: FRAGMENT_SOURCE,
    side: THREE.DoubleSide,
})
// const mesh = new THREE.Mesh(box, shader);
// scene.add(mesh)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight.position.set(10, 10, 10)
// scene.add(directionalLight)

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()

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

