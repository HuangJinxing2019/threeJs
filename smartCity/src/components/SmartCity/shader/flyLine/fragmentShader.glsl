precision lowp float;
varying float vSize;
uniform vec3 uColor;

void main(){
    // 将方形点变成圆形
    // 点粒子距离点中心的距离
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
    float strength = 1.0 - (distanceToCenter * 2.0);
    if (vSize < 0.0){
        gl_FragColor = vec4(uColor, 0.0);
    } else {
        gl_FragColor = vec4(uColor, strength);
    }
}