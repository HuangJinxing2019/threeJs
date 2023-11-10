import * as THREE from 'three';
export default function useEdgesGeometry(geometry, color){
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const lineSegments = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({ color: color }));
    return [lineSegments]
}