precision lowp float;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;
varying float vImgIndex;
varying vec3 vColor;
void main(){
    vec4 texureColor;
    if(vImgIndex == 0.0){
        texureColor = texture2D(uTexture1, gl_PointCoord);
    } else if(vImgIndex == 1.0) {
        texureColor = texture2D(uTexture2, gl_PointCoord);
    } else {
        texureColor = texture2D(uTexture3, gl_PointCoord);
    }
    gl_FragColor = vec4(vColor, texureColor.r);
}
