import { defineStore, acceptHMRUpdate } from "pinia";
import { getDataList, getEventList } from "../api/index.js";
import gsap from "gsap";

export const useCityStore = defineStore({
    id: 'city',
    state: () => ({
        infoList: [],
        eventList: [],
        currentId: null,
        spriteMesh: [],
        orbitControls: null,
        camera: null,
    }),

    actions: {
        spriteMeshAdd(mesh){
            this.spriteMesh.push(mesh)
        },
        clearSpriteMesh(){
            this.spriteMesh = []
        },
        setCamera(camera){
            this.camera = camera;
        },
        setCurrentId(id){
            this.currentId = id;
        },
        setOrbitControls(orbitControls){
            this.orbitControls = orbitControls;
        },
        updateTargetAndLookAt(position){
            gsap.to(this.orbitControls.target, {
                duration: 1,
                x: position.x,
                y: 0,
                z: position.z,
            })
            gsap.to(this.camera.lookAt, {
                duration: 1,
                x: position.x,
                y: 0,
                z: position.z,
            })
        },
        async getInfoList(){
            const res = await getDataList();
            this.infoList = res.data.data;

        },
        async getEventList(){
            const res = await getEventList();
            this.eventList = res.data.data.list;
        }
    }
})