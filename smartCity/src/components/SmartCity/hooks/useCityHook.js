import * as THREE from 'three';
import { GLTFLoader } from "three/addons";
import useModifyCityMaterial from "./useModifyCityMaterial.js";
import useFlyLine from "./useFlyLine.js";
import useEdgesGeometry from "./useEdgesGeometry.js";
export default function useCity(scene){
    new GLTFLoader().load(new URL('/public/models/city.glb', import.meta.url).href, (gltf) => {
        // 遍历，修改材质类型
        gltf.scene.traverse(item => {
            if(item.type === 'Mesh'){
                item.material = new THREE.MeshBasicMaterial({ color: 0x0c0e33 });
                useModifyCityMaterial(item);
                if(item.name === 'Layerbuildings'){
                   const [line] =  useEdgesGeometry(item.geometry, '#ffffff');
                   const size = item.scale.x * 1.002
                   line.scale.set(size, size, size);
                   scene.add(line);
                }
            }
        })
        scene.add(gltf.scene);

        const [flyLine] = useFlyLine({
            points: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(8, 4, 0),
                new THREE.Vector3(13, 0, 0),
            ],
            color: '#fff000',
        });
        scene.add(flyLine);
    })
}
