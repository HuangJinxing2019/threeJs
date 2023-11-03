import * as THREE from 'three';
import POINT_VERTEX_SOURCE from '../shader/pointVertex.glsl?raw';
import POINT_FRAGMENT_SOURCE from  '../shader/pointFragment.glsl?raw';
import FIREWORKS_VERTEX_SOURCE from '../shader/fireworksVertex.glsl?raw';
import FIREWORKS_FRAGMENT_SOURCE from  '../shader/fireworksFragment.glsl?raw';

export default class Fireworks{
    constructor({scene, startPosition, endPosition, color = '#ffff00', renderer}) {
        this.scene = scene;
        this.startPosition = startPosition;
        this.endPostion = endPosition;
        this.clock = new THREE.Clock();
        this.isBlow = false;
        this.color = new THREE.Color(color);
        this.renderer = renderer
    }
    send(size = 10.0){
        this.sendSize = size;
        this.createFireworks()
    }
    // 创建烟花
    createFireworks(){
        this.bufferGeometry = new THREE.BufferGeometry();
        const from = this.startPosition;
        const to = this.endPostion;
        const position = new Float32Array([from.x, from.y, from.z]);
        const aStep = new Float32Array([to.x - from.x, to.y - from.y, to.z - from.z])
        this.bufferGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
        this.bufferGeometry.setAttribute('aStep', new THREE.BufferAttribute(aStep, 3));
        this.shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: POINT_VERTEX_SOURCE,
            fragmentShader: POINT_FRAGMENT_SOURCE,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            uniforms:{
                uPointSize: {
                    value: this.sendSize,
                },
                uTime: {
                    value: 0,
                },
                uColor: {
                    value: this.color,
                }
            }
        });
        this.startFirework = new THREE.Points(this.bufferGeometry, this.shaderMaterial);
        this.scene.add(this.startFirework)
    }
    blow(){
        this.isBlow = true;
        this.clearStartFireworks();
        // 烟花点的数量
        this.pointCount = 180 + Math.random() * 180;
        this.blowBufferGeometry = new THREE.BufferGeometry();
        const [position, aRandom, aScale] = this.setBlowPosition(this.pointCount);

        this.blowBufferGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
        this.blowBufferGeometry.setAttribute('aRandom', new THREE.BufferAttribute(aRandom, 3));
        this.blowBufferGeometry.setAttribute('aScale', new THREE.BufferAttribute(aScale, 1));
        this.blowMaterial = new THREE.ShaderMaterial({
            vertexShader: FIREWORKS_VERTEX_SOURCE,
            fragmentShader: FIREWORKS_FRAGMENT_SOURCE,
            side: THREE.DoubleSide,
            depthWrite: false,
            transparent: true,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: {
                    value: 0,
                },
                uPointSize: {
                    value: this.sendSize,
                },
                uColor: {
                    value: this.color,
                }
            }
        })
        this.blowPoints = new THREE.Points(this.blowBufferGeometry, this.blowMaterial)
        this.scene.add(this.blowPoints)
        // if(this.renderer.toneMappingExposure < 0.4){
        //     this.renderer.toneMappingExposure += 0.05
        //     setTimeout(() => {
        //         this.renderer.toneMappingExposure -= 0.05
        //     }, 500)
        // }
    }
    // 设置场景的曝光强度
    setToneMappingExposure(time){
        if(time < 0.2 && this.renderer.toneMappingExposure < 0.4){
            this.renderer.toneMappingExposure += time * 0.08
        } else if (time < 0.4 && this.renderer.toneMappingExposure > 0.1){
            this.renderer.toneMappingExposure -= time * 0.03
        }
    }
    setBlowPosition(num){
        const start = this.endPostion;
        const position = new Float32Array(num * 3);
        const aRandom = new Float32Array(num * 3);
        const aScale = new Float32Array(num);
        for(let i = 0; i < num; i ++){
            let current = i * 3;
            // 爆炸位置
            position[current] = start.x;
            position[current + 1] = start.y;
            position[current + 2] = start.z;
            // 爆炸的粒子大小
            aScale[i] = Math.random();
            // 设置发散的角度
            let theta = Math.random() * 2 * Math.PI;
            let beta = Math.random() * 2 * Math.PI;
            let r = Math.random();
            aRandom[current] = r * Math.sin(theta) + r * Math.sin(beta);
            aRandom[current + 1] = r * Math.cos(theta) + r * Math.cos(beta);
            aRandom[current + 2] = r * Math.sin(theta) + r * Math.cos(beta);
        }
        return [position, aRandom, aScale];
    }
    update(){
        const time = this.clock.getElapsedTime()
        if(time < 1){
            this.shaderMaterial.uniforms.uTime.value = time
        } else {
            if(!this.isBlow) this.blow()
            this.setToneMappingExposure(time - 1)
            this.blowMaterial.uniforms.uTime.value = (time - 1)
            if(time > 3){
                this.clearFireworks()
                return true
            }
        }
    }
    clearStartFireworks(){
        this.startFirework.clear();
        this.bufferGeometry.dispose();
        this.shaderMaterial.dispose();
        this.scene.remove(this.startFirework);
    }
    clearFireworks(){
        this.blowPoints.clear();
        this.blowBufferGeometry.dispose();
        this.blowMaterial.dispose();
        this.scene.remove(this.blowPoints);
    }
}
