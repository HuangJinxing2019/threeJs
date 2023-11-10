import {shader} from "three/nodes";
import * as THREE from 'three'
import gsap from 'gsap'

export default function useModifyCityMaterial(mesh) {
    mesh.material.onBeforeCompile = function (shader) {
        // 设置片元着色器底部标记，后面修改是就根据这个标记定位添加/修改。
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            #include <dithering_fragment>
            //#end# 
            `);
        addGradColor(shader, '#0c0e33', '#aaaeff');
        addSpreadColor(shader, {x: 0, y: 0}, 100, '#ccccff')
        addLightLine(shader, 500, '#ff99ff')
        toTopLine(shader, 200, '#33eeff')
    }

    // 添加底部到顶部的渐变色
    function addGradColor(shader, bottomColor, topColor) {
        // 获取模型的高度
        mesh.geometry.computeBoundingBox();
        const {min, max} = mesh.geometry.boundingBox;
        const modelHeight = max.y - min.y;
        // 高度传递给片元着色器
        shader.uniforms.uModelHeight = {value: modelHeight};
        // 传递渐变颜色
        shader.uniforms.uBottomColor = {value: new THREE.Color(bottomColor)}
        shader.uniforms.uTopColor = {value: new THREE.Color(topColor)}

        // 顶点坐标通过varying传递给片元着色器
        shader.vertexShader = shader.vertexShader.replace('#include <common>',
            `
            #include <common>
            varying vec3 vPosition;
            `
        )
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
            `
            #include <begin_vertex>
            vPosition = position;
            `
        )
        // 片元着色器添加变量
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>',
            `
            #include <common>
            varying vec3 vPosition;
            uniform float uModelHeight;
            uniform vec3 uBottomColor;
            uniform vec3 uTopColor;
            `
        )
        // 设置颜色混入
        shader.fragmentShader = shader.fragmentShader.replace('//#end#',
            `
            // 混合颜色百分比
            float gradMix = (vPosition.y + uModelHeight / 2.0) / uModelHeight;
            vec3 gradMixColor = mix(uBottomColor, uTopColor, gradMix);
            gl_FragColor = vec4(gradMixColor, 1.0);
            //#end#
            `
        )
    }

    // 添加光波效果
    function addSpreadColor(shader, local, width, color) {
        shader.uniforms.uSpreadCenter = {value: new THREE.Vector2(local.x, local.y)}
        shader.uniforms.uSpreadWidth = {value: width}
        shader.uniforms.uSpreadColor = {value: new THREE.Color(color)}
        shader.uniforms.uSpreadTime = {value: 0}

        shader.fragmentShader = shader.fragmentShader.replace('#include <common>',
            `
            #include <common>
            uniform vec2 uSpreadCenter;
            uniform float uSpreadWidth;
            uniform vec3 uSpreadColor;
            uniform float uSpreadTime;
            `
        )

        shader.fragmentShader = shader.fragmentShader.replace('//#end#',
            `
            // 获取半径，xz坐标距离扩散中心点的距离
            float spreadRadius = distance(vPosition.xz, uSpreadCenter);
            float spreadIndex = -((spreadRadius - uSpreadTime) * (spreadRadius - uSpreadTime)) + uSpreadWidth;
            if(spreadIndex > 0.0){
                gl_FragColor = mix(gl_FragColor, vec4(uSpreadColor, 1.0), spreadIndex / uSpreadWidth);
            }
            //#end#
            `
        )
        gsap.to(shader.uniforms.uSpreadTime, {
            value: 800,
            duration: 2,
            repeat: -1,
        })
    }

    // 添加灯条
    function addLightLine(shader, lineWidth, color) {
        shader.uniforms.uLineColor = {value: new THREE.Color(color)}
        shader.uniforms.uLineWidth = {value: lineWidth}
        shader.uniforms.uLineTime = {value: -1500}
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>',
            `
            #include <common>
            uniform vec3 uLineColor;
            uniform float uLineWidth;
            uniform float uLineTime;
            `
        )
        shader.fragmentShader = shader.fragmentShader.replace('//#end#',
            `
            float lineIndex = -((vPosition.x + vPosition.z - uLineTime) * (vPosition.x + vPosition.z - uLineTime)) + uLineWidth;
            if(lineIndex > 0.0){
                gl_FragColor = mix(gl_FragColor, vec4(uLineColor, 1.0), lineIndex / uLineWidth);
            }
            //#end#
            `
        )
        gsap.to(shader.uniforms.uLineTime, {
            value: 1500,
            duration: 8,
            repeat: -1,
        })
    }
    // 添加向上扫描
    function toTopLine(shader, width, color){
        shader.uniforms.uTopLineWidth = { value: width };
        shader.uniforms.uTopLineColor = { value: new THREE.Color(color) }
        shader.uniforms.uTopLineTime = { value: 0 }
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>',
            `
            #include <common>
            uniform vec3 uTopLineColor;
            uniform float uTopLineWidth;
            uniform float uTopLineTime;
            `
        )
        shader.fragmentShader = shader.fragmentShader.replace('//#end#',
            `
            float toLineIndex = -((vPosition.y - uTopLineTime) * (vPosition.y - uTopLineTime)) + uTopLineWidth;
            if(toLineIndex > 0.0){
                gl_FragColor = mix(gl_FragColor, vec4(uTopLineColor, 1.0), toLineIndex / uTopLineWidth);
            }
            //#end#
            `
        )
        gsap.to(shader.uniforms.uTopLineTime, {
            value: 200,
            duration: 3,
            repeat: -1,
        })
    }
}
