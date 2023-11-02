attribute float aScale;
attribute vec3 aRandom;
uniform float uTime;
uniform float uPointSize;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.xyz += aRandom * uTime * 10.0;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    gl_PointSize = uPointSize * aScale * (1.0 - uTime * aScale);
}