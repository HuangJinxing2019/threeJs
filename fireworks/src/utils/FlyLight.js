import gsap from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import * as THREE from "three";
import VERTEX_SOURCE from "../shader/flyLightVertex.glsl?raw";
import FRAGMENT_SOURCE from "../shader/flyLightGragment.glsl?raw";
export default class FlyLight{
    constructor(scene) {
        this.scene = scene;
        this.gltf = null;
    }
    create(url, number){
        let flyLightBox;
        new GLTFLoader().loadAsync(url).then((gltf) => {
            this.gltf = gltf;
            flyLightBox = gltf.scene.children[0];
            flyLightBox.material = this.createShader();
            this.setPosition(number);
        })
    }
    createShader(){
        this.shader =  new THREE.ShaderMaterial({
            vertexShader: VERTEX_SOURCE,
            fragmentShader: FRAGMENT_SOURCE,
            side: THREE.DoubleSide,
        })
        return this.shader;
    }
    setPosition(number){
        for (let i = 0; i < number; i++) {
            let flyLight = this.gltf.scene.clone(true);
            let y = Math.random() * 80 + 15;
            let x = (Math.random() - 0.5) * 300;
            let z = (Math.random() - 0.5) * 300;
            flyLight.position.set(x, y, z)
            gsap.to(flyLight.rotation, {
                y: 2 * Math.PI,
                duration: 5 + Math.random() * 40,
                repeat: -1,
            })
            gsap.to(flyLight.position, {
                x: '+=' + Math.PI + Math.random() * 20,
                y: '+=' + Math.PI + Math.random() * 10,
                duration: 5 + Math.random() * 30,
                yoyo: true,
                repeat: -1,
            })
            this.scene.add(flyLight)
        }
    }
}