varying vec2 vUv;
void main(){
    vUv = uv;
    vec4 position = vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * position;
}