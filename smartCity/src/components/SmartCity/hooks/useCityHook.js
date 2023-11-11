import * as THREE from 'three';
import { GLTFLoader } from "three/addons";
import useModifyCityMaterial from "./useModifyCityMaterial.js";
import useFlyLine from "./useFlyLine.js";
import useEdgesGeometry from "./useEdgesGeometry.js";
import useLightWell from "./useLightWell.js";
import useRadar from "./useRadar.js";
import useSprite from "./useSprite.js";
import { useCityStore } from "../../../stores/city.js";


export default function useCity(scene, camera){
    const cityStore = useCityStore();
    let meshRemoveFnArr = [];
    new GLTFLoader().load(new URL('/public/models/city.glb', import.meta.url).href, (gltf) => {
        // 遍历，修改材质类型
        gltf.scene.traverse(item => {
            if(item.type === 'Mesh'){
                item.material = new THREE.MeshBasicMaterial({ color: 0x0c0e33 });
                useModifyCityMaterial(item);
                if(item.name === 'Layerbuildings'){
                   const [line] =  useEdgesGeometry(item.geometry, '#ffffff');
                   const size = item.scale.x * 1.001
                   line.scale.set(size, size, size);
                   scene.add(line);
                }
            }
        })
        scene.add(gltf.scene);
    })
    const cubeTexture = new THREE.CubeTextureLoader().load([
        new URL('/public/textures/1.jpg', import.meta.url).href,
        new URL('/public/textures/2.jpg', import.meta.url).href,
        new URL('/public/textures/3.jpg', import.meta.url).href,
        new URL('/public/textures/4.jpg', import.meta.url).href,
        new URL('/public/textures/5.jpg', import.meta.url).href,
        new URL('/public/textures/6.jpg', import.meta.url).href,
    ])
    scene.background = cubeTexture;

    // 添加飞线
    function flyLineAdd(option){
        const [flyLine, { remove }] = useFlyLine({
            points: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(option.x/2, 4, 0),
                new THREE.Vector3(option.x, 0, option.z),
            ],
            color: '#fff000',
        });
        meshRemoveFnArr.push(remove)
        scene.add(flyLine);
    }

    // 添加光墙
    function lightWellAdd(option){
        const [lightWell, { remove }] = useLightWell([1, 1, 2, 32, 1, true], [option.x, 1, option.z])
        meshRemoveFnArr.push(remove)
        scene.add(lightWell)
    }
    // 添加雷达
    function radarAdd(option){
       const [radar, { remove }] = useRadar(3, [option.x, 0.5, option.z], '#00ff00');
       meshRemoveFnArr.push(remove)
       scene.add(radar)
    }
    // 添加精灵图
    function spriteAdd(option, icon, id){
        const texture = new THREE.TextureLoader().load(new URL(`/public/textures/${icon}`, import.meta.url).href);
        const [ sprite, { remove }] = useSprite(texture, [option.x, 3.5, option.z], true, clickSpriteChange, camera);
        meshRemoveFnArr.push(remove)
        sprite.name = id;
        cityStore.spriteMeshAdd(sprite);
        scene.add(sprite);
    }
    function clickSpriteChange(mesh){
        cityStore.setCurrentId(mesh.name)
        cityStore.updateTargetAndLookAt(mesh.position)
    }
    function cleanAll(){
        meshRemoveFnArr.forEach(fn => fn())
        meshRemoveFnArr = []
    }
    return {
        flyLineAdd,
        lightWellAdd,
        radarAdd,
        spriteAdd,
        cleanAll,
    }
}
