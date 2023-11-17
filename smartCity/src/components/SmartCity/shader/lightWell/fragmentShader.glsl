precision lowp float;
uniform float uHeight;
uniform vec3 uColor;
varying vec3 vPosition;
void main(){
    float opactiy = 1.0 - (vPosition.y + uHeight / 2.0) / uHeight;
    gl_FragColor = vec4(uColor, opactiy);
}