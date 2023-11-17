import * as THREE from 'three';
import vertexShader from '../shader/lightWell/vertexShader.glsl?raw'
import fragmentShader from '../shader/lightWell/fragmentShader.glsl?raw'
import gsap from "gsap";
export default function useLightWell(
    cylinderOption,
    position= [0, 0, 0],
    color='#fff000'
){
    const cylinderGeometry = new THREE.CylinderGeometry(...cylinderOption);
    // 获取光墙高度
    cylinderGeometry.computeBoundingBox();
    const { min, max } = cylinderGeometry.boundingBox
    const height = max.y - min.y;

    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uHeight: { value: height },
            uColor: { value: new THREE.Color(color) }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
    });
    const mesh = new THREE.Mesh(cylinderGeometry, shaderMaterial);
    mesh.position.set(...position);
    gsap.to(mesh.scale, {
        x: 4,
        z: 4,
        duration: 2,
        ease: 'none',
        yoyo: true,
        repeat: -1,
    })
    function remove(){
        mesh.removeFromParent();
        mesh.material.dispose();
        mesh.geometry.dispose();
    }
    return [mesh,{ remove }]
}