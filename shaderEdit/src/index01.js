import  * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls";

const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, false);
document.body.append(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

const meshBasicMaterial = new THREE.MeshBasicMaterial( {
    color: '#ffff00',
    side: THREE.DoubleSide,
});

const basicUniform = {
    uTime: {
        value: 0
    }
}
meshBasicMaterial.onBeforeCompile = function (shader, renderer) {
    shader.uniforms.uTime = basicUniform.uTime
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `
       #include <common>
       uniform float uTime;
    `)
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
       #include <begin_vertex>
       transformed.x += sin(uTime)* 2.0;
       transformed.z += cos(uTime)* 2.0;
    `)

    console.log(shader.vertexShader)
}

const planeGeometry = new THREE.PlaneGeometry(1,1);
const mesh = new THREE.Mesh(planeGeometry, meshBasicMaterial);
scene.add(mesh);

function animate(time) {
    requestAnimationFrame(animate)
    basicUniform.uTime.value = time / 1000
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

