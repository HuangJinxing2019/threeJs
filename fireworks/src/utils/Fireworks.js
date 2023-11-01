import * as THREE from 'three';
import POINT_VERTEX_SOURCE from '../shader/pointVertex.glsl?raw';
import POINT_FRAGMENT_SOURCE from  '../shader/pointFragment.glsl?raw';

export default class Fireworks{
    constructor(scene, startPosition, endPosition) {
        this.scene = scene;
        this.startPosition = startPosition;
        this.endPostion = endPosition;
    }
    send(size = 10.0){
        this.sendSize = size;
        this.createFireworks()
    }
    // 创建烟花
    createFireworks(){
        const bufferGeometry = new THREE.BufferGeometry();
        const position = new Float32Array([this.startPosition.x, this.startPosition.y, this.startPosition.z]);
        bufferGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: POINT_VERTEX_SOURCE,
            fragmentShader: POINT_FRAGMENT_SOURCE,
            side: THREE.DoubleSide,
            transparent: true,
            uniforms:{
                uPointSize: {
                    value: this.sendSize,
                }
            }
        });
        this.startFirework = new THREE.Points(bufferGeometry, shaderMaterial);
        this.scene.add(this.startFirework)
    }
}