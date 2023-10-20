import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { gsap } from "gsap";

// 创建一个renderer
const renderer = new THREE.WebGLRenderer();
// 设置画布的大小
renderer.setSize(window.innerWidth, window.innerHeight, false);
// 在body添加canvas画布
document.body.appendChild(renderer.domElement);

// 创建一个透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 5);

// 创建一个场景
const scene = new THREE.Scene();
// 创建一个几何体
const planeGeometry = new THREE.PlaneGeometry(2, 2, 200, 200)

// 使用着色器创建材质
// 顶点着色器源码
const vertexShaderSource = `
    uniform float uTime;
    varying vec2 vUv;
    varying float positionZ;
    void main(){
        vUv = uv;
        vec4 position = vec4(position, 1.0);
        position.z = sin(position.x * 10.0 + uTime) * 0.05;
        position.z += sin(position.y * 10.0 + uTime) * 0.05;
        positionZ = position.z;
        gl_Position = projectionMatrix * modelViewMatrix * position;
    }
`
// 片源着色器
const fragmentShaderSource = `
    precision mediump float;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    varying float positionZ;
    void main(){
        vec4 textureColor = texture2D(uTexture, vUv);
        textureColor.rgb *= positionZ + 0.8;
        gl_FragColor = textureColor;
    } 
`
// 加载纹理图片
const texture = new THREE.TextureLoader().load(new URL('../assets/texture/img.png', import.meta.url).href);

let shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: {
            value: 0,
        },
        uTexture: {
            value: texture,
        }
    }
});

const plan = new THREE.Mesh(planeGeometry, shaderMaterial);
// 将物体添加至场景中
scene.add(plan)


// 添加坐标轴参考线
const axesHelper = new THREE.AxesHelper(5)
axesHelper.material.depthTest = false;
axesHelper.renderOrder = 1;
scene.add(axesHelper);

// 添加轨道控制器
const orbitControls = new OrbitControls(camera, renderer.domElement);
// 启用阻尼，让鼠标动作有点惯性效果，不显得那么的生硬。
orbitControls.enableDamping = true;

// 创建时钟对象
function animate(time){
    requestAnimationFrame(animate)
    shaderMaterial.uniforms.uTime.value = time / 100
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

