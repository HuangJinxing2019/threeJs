precision mediump float;

uniform float uTime;
varying vec2 vUv;

#define PI 3.1415926535897932384626433
// 随机函数
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 旋转函数
// uv：坐标， rotation： 旋转角度， mid：旋转的中心点
vec2 rotate(vec2 uv, float rotation, vec2 mid){
    return vec2 (
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

//	Classic Perlin 2D Noise
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0);// To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;// 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main(){
    //    使用uv坐标设置着色器颜色
    //    gl_FragColor = vec4(vUv, 0.0, 1.0);
    //    gl_FragColor = vec4(vUv.x, vUv.x, vUv.x,1.0);

    //    通过取模达到反复的效果mod(x, y), 返回x和y的摸 ， 2.3 % 1 = 0.3
    //    float stength = mod(vUv.y * 10.0, 1.0);
    //    gl_FragColor = vec4(stength, stength, stength ,1.0);

    //    使用step(edge, x),实现斑马条纹效果, 如果 x < edge,返回0.0, 否则返回1.0
    //    float stength = mod(vUv.y * 10.0, 1.0);
    //    stength = step(0.5, stength);
    //    gl_FragColor = vec4(stength, stength, stength ,1.0);

    //    条纹相加效果。
    //    float stength = step(0.5, mod(vUv.x * 10.0, 1.0));
    //    stength += step(0.5, mod(vUv.y * 10.0, 1.0));
    //    gl_FragColor = vec4(stength, stength, stength ,1.0);

    //    条纹相乘效果，方块效果。
    //    float stength = step(0.2, mod(vUv.x * 10.0, 1.0));
    //    stength *= step(0.2, mod(vUv.y * 10.0, 1.0));
    //    gl_FragColor = vec4(stength, stength, stength ,1.0);

    //    T形图
    //    float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    //    float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    //    float stength = barX + barY;
    //    gl_FragColor = vec4(stength, stength, stength ,1.0);

    //    利用abs(x)取绝对值
    //    float stength = abs(vUv.x - 0.5);
    //    gl_FragColor = vec4(stength, stength, stength ,1.0);

    //    使用min(x, y) 返回x 和 y的值较小的那个值
    //    float stength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    //    gl_FragColor = vec4(stength, stength, stength ,1.0);

    //    使用max(x, y) 返回x 和 y的值较大的那个值
    //    float stength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    //    gl_FragColor = vec4(stength, stength, stength ,1.0);

    //    利用取整实现阶段性的图形变化
    //    float stength = floor(vUv.x * 10.0) / 10.0;
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    随机效果 thebookofshaders.com
    //    float stength = random(vUv);
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    float stength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    //    stength = random(vec2(stength, stength));
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    length(x)返回向量长度
    //    float stength = length(vUv - 0.5);
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    根据distance计算两个向量（两个点）的距离
    //    float stength = 1.0 - distance(vUv, vec2(0.5, 0.5));
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);
    //    根据相除，实现星星
    //    float stength = 0.15 / distance(vUv, vec2(0.5, 0.5)) - 1.0;
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    float stength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    //    stength += 0.15 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    旋转飞镖， 旋转uv
    //    vec2 rotateUv = rotate(vUv, uTime, vec2(0.5, 0.5));
    //    float stength = 0.15 / distance(vec2(rotateUv.x, (rotateUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    //    stength += 0.15 / distance(vec2(rotateUv.y, (rotateUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    画一个圆
    ////    float stength = step(0.5, distance(vUv, vec2(0.5, 0.5)));
    //    float stength = step(0.5, distance(vUv, vec2(0.5, 0.5)) + 0.25);
    ////    float stength = 1.0 - step(0.5, distance(vUv, vec2(0.5, 0.5)) + 0.25);
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    绘制圆环
    //    float stength = step(0.5, distance(vUv, vec2(0.5, 0.5)) + 0.35);
    //    stength *= (1.0 - step(0.5, distance(vUv, vec2(0.5, 0.5)) + 0.25));
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    渐变圆环
    //    float stength = abs(distance(vUv, vec2(0.5, 0.5)) - 0.25);
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    绘制圆环2
    //    float stength = step(0.1, abs(distance(vUv, vec2(0.5, 0.5)) - 0.25));
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);


    //    波浪纹
    //    vec2 waveUv = vec2(
    //        vUv.x,
    //        vUv.y + sin(vUv.x * 30.0) * 0.1
    //    );
    //    float stength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5, 0.5)) - 0.25));
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);


    //    使用atan 获得雷达扫描效果
    //    float stength = atan(vUv.x, vUv.y);
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    //    float stength = angle;
    //    gl_FragColor = vec4(stength, stength, stength, 1);

    //    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    //    float stength = (angle + 3.14) / 6.28;
    //    gl_FragColor = vec4(stength, stength, stength, 1);

    //    float alpha = 1.0 - step(0.5, distance(vUv, vec2(0.5)));
    //    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    //    float stength = (angle + 3.14) / 6.28;
    //    gl_FragColor = vec4(stength, stength, stength, alpha);

    //    动态旋转
    //    vec2 rotateUv = rotate(vUv, uTime * 5.0, vec2(0.5));
    //    float alpha = 1.0 - step(0.5, distance(vUv, vec2(0.5)));
    //    float angle = atan(rotateUv.x - 0.5, rotateUv.y - 0.5);
    //    float stength = (angle + 3.14) / 6.28;
    //    gl_FragColor = vec4(stength, stength, stength, alpha);

    //    万花筒
    //    float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (2.0 * PI);
    //    float strength = mod(angle * 10.0, 1.0);
    //    gl_FragColor = vec4(strength, strength, strength, 1.0);

    //    光芒四射
    //    float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (2.0 * PI);
    //    float strength = sin(angle * 100.0);
    //    gl_FragColor = vec4(strength, strength, strength, 1.0);

    //    使用噪声实现烟雾，波纹效果
    //    float stength = noise(vUv);
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //    float stength = step(0.5, noise(vUv * 10.0));
    //    gl_FragColor = vec4(stength, stength, stength, 1.0);

    //     波纹效果
    //     float strength = sin(cnoise(vUv * 10.0)*5.0+uTime) ;
    //     gl_FragColor =vec4(strength,strength,strength,1);

    //     float strength = step(0.9,sin(cnoise(vUv * 10.0)*20.0));
    //     gl_FragColor =vec4(strength,strength,strength,1);


    // 使用混合函数混颜色
    vec3 purpleColor = vec3(1.0, 0.0, 1.0);
    vec3 greenColor = vec3(1.0, 1.0, 1.0);
    vec3 uvColor = vec3(vUv, 1.0);
    float strength = step(0.9, sin(cnoise(vUv * 10.0)*20.0));

    vec3 mixColor =  mix(greenColor, uvColor, strength);
    gl_FragColor =vec4(mixColor, 1.0);


    //    clamp(x, minVal, maxVal),将x值钳于minVal和maxVal之间，意思就是当x < minVal时返回minVal,当x > maxVal时返回maxVal, 当x在minVal和maxVal之间时， 返回x

}