// ════════════════════════════════════════════════════════════
// Fluid — calm ink-and-teal stable-fluids background, all rooms.
// A hand-written GPU dye solver in the classic stable-fluids shape
// (splat → curl → vorticity → divergence → pressure Jacobi →
// gradient subtract → advect → display). No dependency, no CDN:
// GitHub Pages safe. Dye is faint ink that flashes teal with
// pointer speed, over the exact carbon ground (#0a0c10). Idles to
// ~15fps after 12s without pointer input (battery).
//
// Renders nothing under prefers-reduced-motion or WebGL failure
// (the flat carbon body background remains).
// ════════════════════════════════════════════════════════════
import { useEffect, useRef, useState } from "react";

const INK = [0.925, 0.902, 0.839];   /* --ink #ebe6d6 */
const TEAL = [0.243, 0.749, 0.776];  /* --accent #3ebfc6 */
const GROUND = [0.0392, 0.0471, 0.0627]; /* --bg #0a0c10 */

const BASE_VERT = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const SPLAT_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}`;

const ADVECTION_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform vec2 dyeTexelSize;
uniform float dt;
uniform float dissipation;
vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}
void main () {
#ifdef MANUAL_FILTERING
  vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
  vec4 result = bilerp(uSource, coord, dyeTexelSize);
#else
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  vec4 result = texture2D(uSource, coord);
#endif
  float decay = 1.0 + dissipation * dt;
  gl_FragColor = result / decay;
}`;

const DIVERGENCE_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}`;

const CURL_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}`;

const VORTICITY_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += force * dt;
  velocity = min(max(velocity, -1000.0), 1000.0);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`;

const PRESSURE_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`;

const GRADIENT_SUBTRACT_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`;

const CLEAR_FRAG = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`;

/* display: faint dye over the exact carbon ground (no shading pass,
   so the ground always matches --bg even where dye is zero) */
const DISPLAY_FRAG = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 texelSize;
uniform vec2 uCursor;
uniform float uCursorOn;
uniform float uAspect;
vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}
void main () {
#ifdef MANUAL_FILTERING
  vec3 dye = bilerp(uTexture, vUv, texelSize).rgb;
#else
  vec3 dye = texture2D(uTexture, vUv).rgb;
#endif
  /* reading halo: dye fades out around the cursor so text under it
     stays on pure carbon */
  vec2 cdelta = vUv - uCursor;
  cdelta.x *= uAspect;
  float halo = mix(1.0, smoothstep(0.02, 0.10, length(cdelta)), uCursorOn);
  dye *= halo;
  vec3 base = vec3(${GROUND[0]}, ${GROUND[1]}, ${GROUND[2]});
  gl_FragColor = vec4(base + dye, 1.0);
}`;

/* slow pointer → faint ink; fast pointer → teal streaks */
function pointerColor(speed) {
  const t = Math.min(1, speed / 26);
  const k = 0.035 + 0.07 * t;
  const m = 0.12 + 0.88 * t;
  return [
    (INK[0] * (1 - m) + TEAL[0] * m) * k,
    (INK[1] * (1 - m) + TEAL[1] * m) * k,
    (INK[2] * (1 - m) + TEAL[2] * m) * k,
  ];
}

function getWebGLContext(canvas) {
  const params = { alpha: false, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
  let gl = canvas.getContext("webgl2", params);
  const isWebGL2 = !!gl;
  if (!isWebGL2)
    gl = canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params);
  if (!gl) return null;
  let halfFloat;
  let supportLinearFiltering;
  if (isWebGL2) {
    gl.getExtension("EXT_color_buffer_float");
    supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
  } else {
    halfFloat = gl.getExtension("OES_texture_half_float");
    supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  let halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES;
  let formatRGBA, formatRG, formatR;
  if (isWebGL2) {
    formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
    formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
  } else {
    formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatRG = formatRGBA;
    formatR = formatRGBA;
  }
  /* last resort for GPUs without float render targets: plain RGBA8
     dye (quantized, but fine for a faint background wash) */
  if (!formatRGBA) {
    halfFloatTexType = gl.UNSIGNED_BYTE;
    formatRGBA = { internalFormat: gl.RGBA, format: gl.RGBA };
    formatRG = formatRGBA;
    formatR = formatRGBA;
  }
  return {
    gl,
    ext: {
      formatRGBA, formatRG, formatR, halfFloatTexType,
      supportLinearFiltering: !!supportLinearFiltering,
    },
  };
}

function getSupportedFormat(gl, internalFormat, format, type) {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    switch (internalFormat) {
      case gl.R16F: return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
      case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
      default: return null;
    }
  }
  return { internalFormat, format };
}

function supportRenderTextureFormat(gl, internalFormat, format, type) {
  if (type == null) return false;
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
}

function compileShader(gl, type, source, keywords) {
  if (keywords) {
    let prefix = "";
    keywords.forEach(k => { prefix += `#define ${k}\n`; });
    source = prefix + source;
  }
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}

function createProgram(gl, vertexShader, fragmentShaderSource, keywords) {
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource, keywords);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(program));
  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const name = gl.getActiveUniform(program, i).name;
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return {
    program, uniforms,
    bind() { gl.useProgram(program); },
  };
}

export default function Fluid({ reduced }) {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduced) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let cleanup = () => {};
    try {
      cleanup = startFluid(canvas);
    } catch {
      setFailed(true);
    }
    return () => cleanup();
  }, [reduced]);

  if (reduced || failed) return null;
  return <canvas ref={canvasRef} className="fluid-canvas" aria-hidden="true" />;
}

function startFluid(canvas) {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const config = {
    SIM_RESOLUTION: coarse ? 96 : 144,
    DYE_RESOLUTION: coarse ? 256 : 512,
    DENSITY_DISSIPATION: 0.975,
    VELOCITY_DISSIPATION: 0.2,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 22,
    SPLAT_RADIUS: 0.2,
    SPLAT_FORCE: 5200,
  };

  const ctx = getWebGLContext(canvas);
  if (!ctx) throw new Error("no webgl");
  const { gl, ext } = ctx;

  const blit = (() => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    return (target, clear = false) => {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (clear) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };
  })();

  let dye, velocity, divergence, curl, pressure;
  const baseVertexShader = compileShader(gl, gl.VERTEX_SHADER, BASE_VERT);

  const splatProgram = createProgram(gl, baseVertexShader, SPLAT_FRAG);
  const clearProgram = createProgram(gl, baseVertexShader, CLEAR_FRAG);
  const curlProgram = createProgram(gl, baseVertexShader, CURL_FRAG);
  const vorticityProgram = createProgram(gl, baseVertexShader, VORTICITY_FRAG);
  const divergenceProgram = createProgram(gl, baseVertexShader, DIVERGENCE_FRAG);
  const pressureProgram = createProgram(gl, baseVertexShader, PRESSURE_FRAG);
  const gradientSubtractProgram = createProgram(gl, baseVertexShader, GRADIENT_SUBTRACT_FRAG);
  const advectionProgram = createProgram(
    gl, baseVertexShader, ADVECTION_FRAG,
    ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]
  );
  const displayProgram = createProgram(
    gl, baseVertexShader, DISPLAY_FRAG,
    ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]
  );

  function initFramebuffers() {
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);
    const texType = ext.halfFloatTexType;
    const rgba = ext.formatRGBA;
    const rg = ext.formatRG || rgba;
    const r = ext.formatR || rgba;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    gl.disable(gl.BLEND);
    dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
  }

  function getResolution(resolution) {
    let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspect < 1) aspect = 1.0 / aspect;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspect);
    if (gl.drawingBufferWidth > gl.drawingBufferHeight)
      return { width: max, height: min };
    return { width: min, height: max };
  }

  function createFBO(w, h, internalFormat, format, type, param) {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      texture, fbo, width: w, height: h,
      texelSizeX: 1.0 / w, texelSizeY: 1.0 / h,
      attach(id) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  function createDoubleFBO(w, h, internalFormat, format, type, param) {
    let fbo1 = createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = createFBO(w, h, internalFormat, format, type, param);
    return {
      width: w, height: h,
      texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
      get read() { return fbo1; },
      set read(v) { fbo1 = v; },
      get write() { return fbo2; },
      set write(v) { fbo2 = v; },
      swap() { const t = fbo1; fbo1 = fbo2; fbo2 = t; },
    };
  }

  function resizeCanvas() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      return true;
    }
    return false;
  }

  function splat(x, y, dx, dy, color, radius) {
    splatProgram.bind();
    gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(splatProgram.uniforms.point, x, y);
    gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
    gl.uniform1f(splatProgram.uniforms.radius, correctRadius(radius / 100.0));
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
    gl.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2]);
    gl.uniform1f(splatProgram.uniforms.radius, correctRadius(radius / 100.0));
    blit(dye.write);
    dye.swap();
  }

  function correctRadius(radius) {
    const aspect = canvas.width / canvas.height;
    if (aspect > 1) radius *= aspect;
    return radius;
  }

  function step(dt) {
    gl.disable(gl.BLEND);
    curlProgram.bind();
    gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(curl);

    vorticityProgram.bind();
    gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
    gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    divergenceProgram.bind();
    gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);

    clearProgram.bind();
    gl.uniform2f(clearProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    pressureProgram.bind();
    gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    gradientSubtractProgram.bind();
    gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
    gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    advectionProgram.bind();
    gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    if (!ext.supportLinearFiltering)
      gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    const velocityId = velocity.read.attach(0);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
    gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    if (!ext.supportLinearFiltering)
      gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();
  }

  function render() {
    displayProgram.bind();
    gl.uniform2f(displayProgram.uniforms.texelSize, dye.texelSizeX, dye.texelSizeY);
    gl.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
    const cursorOn = px >= 0 ? 1 : 0;
    gl.uniform2f(displayProgram.uniforms.uCursor, cursorOn ? px : 0.5, cursorOn ? py : 0.5);
    gl.uniform1f(displayProgram.uniforms.uCursorOn, cursorOn);
    gl.uniform1f(displayProgram.uniforms.uAspect, canvas.width / canvas.height);
    blit(null);
  }
  /* ── input: pointer stir + ambient drift ──
     (velocity deltas are UV-space, Pavel-scale: px deltas would
     saturate the velocity field and every move would look violent) */
  const aspect = () => canvas.width / canvas.height;
  const correctDeltaX = (d) => { const a = aspect(); return a < 1 ? d * a : d; };
  const correctDeltaY = (d) => { const a = aspect(); return a > 1 ? d / a : d; };

  let px = -1, py = -1;          /* last pointer pos (UV space) */

  const toSim = (cx, cy) => ({ x: cx / canvas.clientWidth, y: 1.0 - cy / canvas.clientHeight });

  const onPointerMove = (e) => {
    noteInput();
    if (e.pointerType === "touch" && e.buttons === 0 && !e.isPrimary) return;
    const p = toSim(e.clientX, e.clientY);
    if (px >= 0) {
      const dx = p.x - px, dy = p.y - py;
      const speed = Math.hypot(e.clientX - px * canvas.clientWidth, e.clientY - (1 - py) * canvas.clientHeight);
      if (speed > 0.5) {
        splat(p.x, p.y, correctDeltaX(dx) * config.SPLAT_FORCE, correctDeltaY(dy) * config.SPLAT_FORCE,
          pointerColor(speed), config.SPLAT_RADIUS);
      }
    }
    px = p.x; py = p.y;
  };
  const onPointerDown = (e) => {
    noteInput();
    const p = toSim(e.clientX, e.clientY);
    splat(p.x, p.y, 0, 0, pointerColor(6), config.SPLAT_RADIUS * 0.9);
  };
  const onPointerLeave = () => { px = -1; py = -1; };

  /* faint idle drift so the ground stays alive without input */
  function ambientSplat() {
    if (document.hidden) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const cx = w * (0.2 + Math.random() * 0.6);
    const cy = h * (0.25 + Math.random() * 0.5);
    const a = Math.random() * Math.PI * 2;
    const sp = 40 + Math.random() * 70;
    const p = toSim(cx, cy);
    const au = Math.cos(a) * sp / canvas.clientWidth, av = -Math.sin(a) * sp / canvas.clientHeight;
    splat(p.x, p.y, correctDeltaX(au) * config.SPLAT_FORCE * 0.2, correctDeltaY(av) * config.SPLAT_FORCE * 0.2,
      [INK[0] * 0.03 + TEAL[0] * 0.008, INK[1] * 0.03 + TEAL[1] * 0.008, INK[2] * 0.03 + TEAL[2] * 0.008],
      0.24);
  }

  /* ── main loop ── */
  resizeCanvas();
  initFramebuffers();
  /* one faint welcome drift so the ground is alive on first paint */
  ambientSplat();

  let raf = 0;
  let lastTime = Date.now();
  let lastInput = Date.now();
  let idleTick = 0;
  const noteInput = () => { lastInput = Date.now(); idleTick = 0; };
  function frame() {
    const now = Date.now();
    /* idle throttle: no pointer input for 12s → simulate at ~15fps
       (battery); any pointer input snaps back to full rate instantly */
    if (now - lastInput > 12000) {
      idleTick += 1;
      if (idleTick % 4 !== 0) {
        lastTime = now;
        raf = requestAnimationFrame(frame);
        return;
      }
    }
    let dt = (now - lastTime) / 1000;
    lastTime = now;
    if (dt > 0.016666) dt = 0.016666;
    step(dt);
    render();
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (resizeCanvas()) initFramebuffers();
    }, 200);
  };
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf) {
      lastTime = Date.now();
      raf = requestAnimationFrame(frame);
    }
  };
  const ambientTimer = window.setInterval(ambientSplat, 2600);

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.documentElement.addEventListener("mouseleave", onPointerLeave);
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    cancelAnimationFrame(raf);
    window.clearInterval(ambientTimer);
    window.clearTimeout(resizeTimer);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerDown);
    document.documentElement.removeEventListener("mouseleave", onPointerLeave);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    /* NOTE: no WEBGL_lose_context here — StrictMode remounts in dev and
       an explicitly lost context never restores, which would kill the
       second mount. Dropping the canvas releases the context. */
  };
}