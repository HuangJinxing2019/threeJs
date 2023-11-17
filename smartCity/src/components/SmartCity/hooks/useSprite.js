import * as THREE from 'three';
export default function useSprite(texture, position, isClick, fn, camera){
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(...position);

    let raycaster, pointer;
    if(isClick && camera){
        raycaster = new THREE.Raycaster();
        pointer = new THREE.Vector2();
        window.addEventListener( 'click', onPointerClick, false );
    }
    function onPointerClick( event ) {
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        // 通过摄像机和鼠标位置更新射线
        raycaster.setFromCamera(pointer, camera)
        // 计算物体和射线的焦点
        const intersects = raycaster.intersectObject( sprite );
        intersects.length > 0 && typeof fn === 'function' && fn(sprite);
    }
    function remove(){
        sprite.removeFromParent();
        sprite.material.dispose();
        sprite.geometry.dispose();
        if(isClick) window.removeEventListener('click', onPointerClick)
    }
    return [sprite, { remove }]
}