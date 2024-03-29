precision lowp float;
uniform vec3 uColor;
uniform float uTime;
varying vec2 vUv;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle));
}
void main(){
    // 根据时间获取新的uv坐标， (vUv-0.5)设置原点为中心
    vec2 newUv = rotate2d(uTime * 3.14) * (vUv-0.5);
    // 恢复原点为左下角
    newUv += 0.5;
    // 形成一个圆形
    float alpha =  1.0 - step(0.5,distance(newUv,vec2(0.5)));
    // 获取坐标的角度
    float angle = atan(newUv.x-0.5,newUv.y-0.5);
    // 获取角度比例
    float strength = (angle + 3.14) / 6.28;
    gl_FragColor =vec4(uColor,alpha * strength);
}