precision lowp float;
varying vec4 vPosition;
varying vec4 gPosition;
void main(){
    vec4 footerColor = vec4(1.0, 1.0, 0, 1.0);
    vec4 topColor = vec4(1.0, 0.0, 0, 1.0);
    vec4 mixColor = mix(footerColor, topColor, gPosition.y / 3.0);
    // 判断是否是表面，表面的颜色稍暗些
    if(gl_FrontFacing){
        //  (vPosition.y-20.0)/80.0, 升到越高，颜色就越暗淡
        gl_FragColor = vec4(mixColor.xyz-(vPosition.y-20.0)/80.0 - 0.1,1);
    } else {
        gl_FragColor = vec4(mixColor.xyz, 1.0);
    }
}
