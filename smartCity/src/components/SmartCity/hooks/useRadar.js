import * as THREE from 'three';
import vertexShader from '../shader/radar/vertexShader.glsl?raw'
import fragmentShader from '../shader/radar/fragmentShader.glsl?raw'
import gsap from "gsap";
export default function useRadar(radius, position, color){
    const planeGeometry = new THREE.PlaneGeometry(radius, radius);
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color(color) },
            uTime: { value: 0, }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
    });
    const mesh = new THREE.Mesh(planeGeometry, shaderMaterial);
    mesh.rotation.x = - Math.PI / 2
    mesh.position.set(...position)
    gsap.to(shaderMaterial.uniforms.uTime, {
        value: -2,
        duration: 2,
        ease: 'none',
        repeat: -1,
    })
    function remove(){
        mesh.removeFromParent();
        mesh.material.dispose();
        mesh.geometry.dispose();
    }
    return [mesh, { remove }]
}