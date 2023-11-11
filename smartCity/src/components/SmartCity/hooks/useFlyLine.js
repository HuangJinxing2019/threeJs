import * as THREE from 'three';
import vertexShader from '../shader/flyLine/vertexShader.glsl?raw'
import fragmentShader from '../shader/flyLine/fragmentShader.glsl?raw'
import gsap from "gsap";
export default function useFlyLine({ points, color }){
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(1000);
    const bufferGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const pointsSize = new Float32Array(curvePoints.length);
    for (let i = 0; i < curvePoints.length; i++){
        pointsSize[i] = i
    }
    bufferGeometry.setAttribute('aSize', new THREE.BufferAttribute(pointsSize, 1));
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uColor: {
                value: new THREE.Color(color)
            },
            uTime: {
                value: 0,
            },
            uPointLength: {
                value: pointsSize.length,
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    const point = new THREE.Points(bufferGeometry, shaderMaterial);
    gsap.to(shaderMaterial.uniforms.uTime, {
        value: 1000,
        duration: 3,
        repeat: -1,
        ease: 'none',
    })
    function remove(){
        point.removeFromParent();
        point.material.dispose();
        point.geometry.dispose();
    }
    return [point, { remove }]
}