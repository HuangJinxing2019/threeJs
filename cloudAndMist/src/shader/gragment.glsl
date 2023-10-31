precision lowp float;
uniform vec3 uHighColor;
uniform vec3 uLowColor;
uniform float uOpacity;
varying float vYCoord;
void main(){
    float a = (vYCoord + 1.0) / 2.0;
    vec3 mixColor = mix(uLowColor, uHighColor, a * 2.0);
    gl_FragColor = vec4(mixColor, uOpacity);
}
