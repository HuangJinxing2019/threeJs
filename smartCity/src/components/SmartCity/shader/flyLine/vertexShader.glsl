attribute float aSize;
varying float vSize;
uniform float uTime;
uniform float uPointLength;

void main(){
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    // 绘制一半路程的飞线，
    vSize = aSize - uTime;
    if(vSize <= 0.0){
        vSize = vSize + uPointLength;
    }
    vSize = (vSize - 600.0) * 0.03;
    // 距离相机越远，粒子越小
    gl_PointSize = - vSize * 10.0 / viewPosition.z;
}