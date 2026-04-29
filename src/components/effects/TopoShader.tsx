"use client";

import { useEffect, useRef } from "react";

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
  precision highp float;
  uniform vec2  u_res;
  uniform float u_time;
  uniform vec2  u_mouse;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i+vec2(0,0)), hash(i+vec2(1,0)), u.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.05; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 px = gl_FragCoord.xy;
    vec2 uv = (px - 0.5*u_res) / u_res.y;
    vec2 m  = (u_mouse - 0.5*u_res) / u_res.y;

    float t = u_time * 0.005;
    float h = fbm(uv * 1.2 + vec2(t * 0.3, -t * 0.2));

    vec2 dm = uv - m;
    float md = length(dm);
    float mound = exp(-md * md * 3.0) * 0.10;
    h += mound;

    float lineSpacing = 16.0;
    float lineWidth   = 0.030;

    float scaled = h * lineSpacing;
    float w = fwidth(scaled);
    float d = abs(fract(scaled) - 0.5);
    float line  = smoothstep(0.5 - lineWidth - w, 0.5 - lineWidth, d);
    line = 1.0 - line;
    float majorMask = step(0.5, fract(scaled * 0.2));
    line *= mix(1.0, 1.25, majorMask);

    float reveal = exp(-md * md * 1.2);
    reveal = max(reveal, 0.06);
    line *= reveal;

    vec3 ink     = vec3(0.039, 0.039, 0.047);
    vec3 paper   = vec3(0.961, 0.941, 0.902);
    vec3 ember   = vec3(1.000, 0.478, 0.271);

    vec3 col = ink;
    vec3 lineCol = paper * 0.55;
    float cursorWarmth = exp(-md * md * 1.0);
    lineCol = mix(lineCol, ember, cursorWarmth * 0.45);

    col += lineCol * line * 0.42;
    col += ember * exp(-md * md * 2.0) * 0.025;

    float vig = 1.0 - smoothstep(0.55, 1.25, length(uv));
    col *= mix(0.7, 1.0, vig);

    float g = (hash(px + u_time) - 0.5) * 0.018;
    col += g;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function TopoShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    gl.getExtension("OES_standard_derivatives");
    const fragWithExt = "#extension GL_OES_standard_derivatives : enable\n" + FRAG;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragWithExt));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uM = gl.getUniformLocation(prog, "u_mouse");

    let mouse = [0, 0];
    let mouseTarget = [0, 0];
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      mouseTarget = [canvas.width * 0.5, canvas.height * 0.5];
      mouse = mouseTarget.slice();
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      mouseTarget = [
        (e.clientX - r.left) * dpr,
        (r.height - (e.clientY - r.top)) * dpr,
      ];
    };

    const frame = (now: number) => {
      mouse[0] += (mouseTarget[0] - mouse[0]) * 0.07;
      mouse[1] += (mouseTarget[1] - mouse[1]) * 0.07;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uM, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" />;
}
