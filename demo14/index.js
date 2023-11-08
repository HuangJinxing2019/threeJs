import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";

let width = window.innerWidth;
let height = window.innerHeight;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, false);
document.body.append(renderer.domElement);


const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = -10
const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.z = 20;
scene.add(directionalLight);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

const catmullRomCurve3 = new THREE.CatmullRomCurve3([
    new THREE.Vector3( -10, 0, 10 ),
    new THREE.Vector3( -5, 5, 5 ),
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 5, -5, 5 ),
    new THREE.Vector3( 10, 0, 10 ),
], true);
const points = catmullRomCurve3.getPoints(50);
const geometry =  new THREE.BufferGeometry().setFromPoints(points);
const lineBasicMaterial = new THREE.LineBasicMaterial({
    color: '#ff0000'
});
const line = new THREE.Line(geometry, lineBasicMaterial);
scene.add(line);
const boxGeometry = new THREE.BoxGeometry(2, 1, 1);
const meshBasicMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
const mesh = new THREE.Mesh(boxGeometry, meshBasicMaterial);
scene.add(mesh);

function  animate(time = 0){
    requestAnimationFrame(animate);
    const point  = catmullRomCurve3.getPoint(time / 10000 % 1);
    const targetPoint  = catmullRomCurve3.getPoint((time + 0.01) / 10000 % 1);
    mesh.position.copy(point)
    mesh.lookAt(targetPoint.x, 0, targetPoint.z);
    renderer.render(scene, camera);
}
animate()

window.addEventListener('resize', resizeChange, false)

function resizeChange(){
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    renderer.setSize(width, height, false)
    camera.updateProjectionMatrix()
}
