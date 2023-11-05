import  * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls";
import {shader} from "three/nodes";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";

const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, false);
renderer.shadowMap.enabled = true;
document.body.append(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 10
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

// 添加环境纹理
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
    new URL('./textures/px.jpg', import.meta.url).href,
    new URL('./textures/nx.jpg', import.meta.url).href,
    new URL('./textures/py.jpg', import.meta.url).href,
    new URL('./textures/ny.jpg', import.meta.url).href,
    new URL('./textures/pz.jpg', import.meta.url).href,
    new URL('./textures/nz.jpg', import.meta.url).href
]);
scene.background = envMapTexture;

const planMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
);
planMesh.position.z = -8;
planMesh.receiveShadow = true;
scene.add(planMesh);


// 添加纹理贴图
const colorTexture = new THREE.TextureLoader().load(new URL('./models/color.jpg', import.meta.url).href)
// 添加法线贴图
const normalTexture = new THREE.TextureLoader().load(new URL('./models/normal.jpg', import.meta.url).href)
// 设置材质
const meshStandardMaterial = new THREE.MeshStandardMaterial({
    map: colorTexture,
    normalMap: normalTexture,
});

const customUniforms = {
    uTime: {
        value: 0,
    }
}

meshStandardMaterial.onBeforeCompile = function (shader){
    shader.uniforms.uTime = customUniforms.uTime;
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `
        #include <common>
        mat2 rotate2d(float _angle){
            return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
        }
        uniform float uTime;
    `)

    shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>', `
        #include <beginnormal_vertex>
        float angle = sin(position.y + +uTime) * 0.5;
        mat2 rotateMatrix = rotate2d(angle);
        objectNormal.xz = rotateMatrix * objectNormal.xz;
    `)

    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
        #include <begin_vertex>
        // 在法线中有定义了，这里就不许要再次定义了，会导致重复定义错误。
        // float angle = sin(position.y + +uTime) * 0.5;
        // mat2 rotateMatrix = rotate2d(angle);
        transformed.xz = rotateMatrix * transformed.xz;
    `)
}
const depthMaterial = new THREE.MeshDepthMaterial({
   depthPacking: THREE.RGBADepthPacking,
})
depthMaterial.onBeforeCompile = function (shader){
    shader.uniforms.uTime = customUniforms.uTime;
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `
        #include <common>
        mat2 rotate2d(float _angle){
            return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
        }
        uniform float uTime;
    `)
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
        #include <begin_vertex>
        float angle = sin(position.y + +uTime) * 0.5;
        mat2 rotateMatrix = rotate2d(angle);
        transformed.xz = rotateMatrix * transformed.xz;
    `)
}

// 添加模型
new GLTFLoader().load(new URL('./models/LeePerrySmith.glb', import.meta.url).href, function (gltf){
    const mesh = gltf.scene.children[0]
    mesh.material = meshStandardMaterial;
    mesh.castShadow = true;
    mesh.customDepthMaterial = depthMaterial;
    scene.add(gltf.scene);
});


// 添加灯光
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.z = 200;
directionalLight.castShadow = true;
scene.add(directionalLight)

function animate(time) {
    requestAnimationFrame(animate)
    customUniforms.uTime.value = time / 1000
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

