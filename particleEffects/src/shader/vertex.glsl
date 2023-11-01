attribute float imgIndex;
attribute float scale;
uniform float uTime;
varying float vImgIndex;
varying vec3 vColor;
void main(){
    vImgIndex = imgIndex;
    vColor = color;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // 获取顶点的角度
    float angle = atan(modelPosition.x, modelPosition.z);
    // 获取顶点到圆心的距离
    float distanceToCenter = length(modelPosition.xz);
    // 根据顶点到中心的距离，设置旋转偏移度数
    float angleoffset = 1.0 / distanceToCenter * uTime;
    // 目前旋转的度数
    angle += angleoffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    // 设置点的大小，根据viewPosition的z坐标决定是否远离摄像机你
    gl_PointSize = 200.0 / - viewPosition.z * scale;
}
