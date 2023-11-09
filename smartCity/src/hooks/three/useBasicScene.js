import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {getStyles} from "../../utils/index.js";
import { onMounted, onBeforeUnmount } from "vue";

const defaultOption = {
    cameraPosition: { x: 0, y: 0, z: 10 },
    cameraLookAt: { x: 0, y: 0, z: 0 },
    showHelper: true,
    showLight: true,
    light: {
        color: '#ffffff',
        intensity: 1,
    }
}
export default function useBasicScene(options) {
    options = {...defaultOption, ...options};
    let width = 100;
    let height = 100;
    let isAppend = false;
    let elDom = null;

    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);
    if(options.showHelper){
        const axesHelper = new THREE.AxesHelper(5);
        axesHelper.material.depthTest = false;
        axesHelper.renderOrder = 1;
        scene.add(axesHelper)
    }
    if(options.showLight){
        const ambientLight = new THREE.AmbientLight(options.light.color, options.light.intensity);
        scene.add(ambientLight);
    }
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;

    camera.position.set(options.cameraPosition.x, options.cameraPosition.y, options.cameraPosition.z);
    camera.lookAt(options.cameraLookAt.x, options.cameraLookAt.y, options.cameraLookAt.z);

    function render(el) {
        elDom = el;
        setRenderSize();
        if(!isAppend){
            el.appendChild(renderer.domElement);
            isAppend = true
        }
        animateRender()
    }

    function setRenderSize(){
        if(!elDom) return;
        const canvas = renderer.domElement;
        width = parseInt(getStyles(elDom, 'width'));
        height = parseInt(getStyles(elDom, 'height'));
        const needResize = canvas.width !== width || canvas.height !== height
        if (needResize){
            renderer.setSize(width, height, false);
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        }
    }
    function animateRender(){
        requestAnimationFrame(animateRender)
        renderer.render(scene, camera)
    }
    onMounted(() => {
        window.addEventListener('resize', setRenderSize, false)
    })
    onBeforeUnmount(() => {
        window.removeEventListener('resize', setRenderSize)
    })

    return [ scene, { render }]
}