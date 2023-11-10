import * as THREE from 'three';
import { GLTFLoader } from "three/addons";
import useModifyCityMaterial from "./useModifyCityMaterial.js";
export default function useCity(scene){
    new GLTFLoader().load(new URL('/public/models/city.glb', import.meta.url).href, (gltf) => {
        // 遍历，修改材质类型
        gltf.scene.traverse(item => {
            if(item.type === 'Mesh'){
                const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x0c0e33 });
                item.material = basicMaterial;
                useModifyCityMaterial(item);
            }
        })
        scene.add(gltf.scene)
    })
}
