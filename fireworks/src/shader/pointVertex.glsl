attribute vec3 aStep;
uniform float uPointSize;
uniform float uTime;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.xyz += (aStep * uTime);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    gl_PointSize = uPointSize;
}