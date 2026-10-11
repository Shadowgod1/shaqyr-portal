import * as React from "react"
import * as THREE from "three"
import { SCENE_COLORS, useSuluStyle } from "@/hooks/use-style"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

// Hero WebGL scene: a breathing "cell" (noise-displaced icosphere with a fresnel
// rim), three orbit rings with travelling molecules, and slow gold dust.
// Follows the threejs-* skills: capped DPR, low segment budgets for background
// pieces, rendering paused offscreen / in hidden tabs, full dispose on unmount.

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

const cellVertex = /* glsl */ `
uniform float uTime; uniform float uAmp;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
${noise}
void main(){
  float n = snoise(normal*1.4 + vec3(uTime*0.18));
  n += 0.5*snoise(normal*3.1 - vec3(uTime*0.11));
  vNoise = n;
  vec3 pos = position + normal * n * uAmp;
  vec4 mv = modelViewMatrix * vec4(pos,1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`

const cellFragment = /* glsl */ `
uniform vec3 uBody; uniform vec3 uDeep; uniform vec3 uRim; uniform vec3 uGold;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
void main(){
  float fres = pow(1.0 - max(dot(normalize(vNormal), vView), 0.0), 2.4);
  vec3 col = mix(uDeep, uBody, smoothstep(-0.6, 0.8, vNoise));
  col = mix(col, uGold, smoothstep(0.55, 1.1, vNoise) * 0.55);
  col += uRim * fres * 0.9;
  gl_FragColor = vec4(col, 0.92 + fres*0.08);
}`

export function HeroScene({ className }: { className?: string }) {
  const host = React.useRef<HTMLDivElement>(null)
  const { style } = useSuluStyle()
  const reduced = useReducedMotion()
  const api = React.useRef<{ setColors: (s: typeof style) => void } | null>(null)

  React.useEffect(() => {
    const el = host.current
    if (!el) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" })
    } catch {
      return // no WebGL: the hero image card still carries the section
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)
    renderer.domElement.setAttribute("aria-hidden", "true")

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
    camera.position.set(0, 0, 7.2)

    const root = new THREE.Group()
    scene.add(root)

    // Cell
    const cellGeo = new THREE.IcosahedronGeometry(1.35, 48)
    const cellMat = new THREE.ShaderMaterial({
      vertexShader: cellVertex,
      fragmentShader: cellFragment,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0.22 },
        uBody: { value: new THREE.Color() },
        uDeep: { value: new THREE.Color() },
        uRim: { value: new THREE.Color() },
        uGold: { value: new THREE.Color() },
      },
    })
    const cell = new THREE.Mesh(cellGeo, cellMat)
    root.add(cell)

    // Orbits + molecules
    const ringGeo = new THREE.TorusGeometry(2.25, 0.008, 6, 160)
    const ringMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55 })
    const nodeGeo = new THREE.SphereGeometry(0.075, 16, 16)
    const nodeMat = new THREE.MeshBasicMaterial()
    const orbits: { pivot: THREE.Group; nodes: THREE.Mesh[]; speed: number; r: number }[] = []
    const tilts: [number, number, number][] = [
      [1.15, 0.2, 0],
      [0.35, -0.9, 0.4],
      [-0.6, 0.7, -0.3],
    ]
    tilts.forEach(([x, y, z], i) => {
      const pivot = new THREE.Group()
      pivot.rotation.set(x, y, z)
      const r = 2.25 - i * 0.22
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.scale.setScalar(r / 2.25)
      pivot.add(ring)
      const nodes: THREE.Mesh[] = []
      for (let k = 0; k < 3; k++) {
        const n = new THREE.Mesh(nodeGeo, nodeMat)
        n.userData.phase = (k / 3) * Math.PI * 2 + i
        pivot.add(n)
        nodes.push(n)
      }
      root.add(pivot)
      orbits.push({ pivot, nodes, speed: 0.35 + i * 0.12, r })
    })

    // Dust
    const COUNT = 520
    const pos = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const r = 2.6 + Math.random() * 3.2
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(p) * Math.cos(t)
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.7
      pos[i * 3 + 2] = r * Math.cos(p) * 0.6
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    const dustMat = new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.75, depthWrite: false })
    const dust = new THREE.Points(dustGeo, dustMat)
    scene.add(dust)

    const setColors = (s: keyof typeof SCENE_COLORS) => {
      const c = SCENE_COLORS[s]
      cellMat.uniforms.uBody.value.set(c.body)
      cellMat.uniforms.uDeep.value.set(c.deep)
      cellMat.uniforms.uRim.value.set(c.rim)
      cellMat.uniforms.uGold.value.set(c.gold)
      ringMat.color.set(c.gold)
      nodeMat.color.set(c.gold)
      dustMat.color.set(c.dust)
    }
    setColors((document.documentElement.dataset.style as keyof typeof SCENE_COLORS) || "classic")

    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = "100%"
      renderer.domElement.style.height = "100%"
      camera.aspect = w / h
      camera.position.z = w / h < 0.9 ? 8.6 : 7.2
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    // Pointer parallax + scroll drift
    const target = { x: 0, y: 0 }
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.6
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener("pointermove", onPointer, { passive: true })

    const timer = new THREE.Timer()
    timer.connect(document)
    let visible = true
    let raf = 0
    const draw = () => {
      timer.update()
      const t = timer.getElapsed()
      const scrollK = Math.min(window.scrollY / window.innerHeight, 1.2)
      cellMat.uniforms.uTime.value = t
      cellMat.uniforms.uAmp.value = 0.2 + Math.sin(t * 0.8) * 0.04
      cell.rotation.y = t * 0.12
      root.rotation.y += (target.x + scrollK * 0.9 - root.rotation.y) * 0.05
      root.rotation.x += (target.y + scrollK * 0.25 - root.rotation.x) * 0.05
      root.position.y = scrollK * 0.8
      orbits.forEach((o) => {
        o.pivot.rotation.z += 0.0015 * o.speed * 4
        o.nodes.forEach((n) => {
          const a = t * o.speed + n.userData.phase
          n.position.set(Math.cos(a) * o.r, Math.sin(a) * o.r, 0)
        })
      })
      dust.rotation.y = t * 0.02
      dust.rotation.x = Math.sin(t * 0.1) * 0.05
      renderer.render(scene, camera)
    }
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (visible && !document.hidden) draw()
    }
    api.current = { setColors: (st) => { setColors(st); if (reduced) draw() } }
    if (reduced) {
      draw()
    } else {
      loop()
    }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 })
    io.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      timer.dispose()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener("pointermove", onPointer)
      ;[cellGeo, ringGeo, nodeGeo, dustGeo].forEach((g) => g.dispose())
      ;[cellMat, ringMat, nodeMat, dustMat].forEach((m) => m.dispose())
      renderer.dispose()
      renderer.domElement.remove()
      api.current = null
    }
  }, [reduced])

  React.useEffect(() => {
    api.current?.setColors(style)
  }, [style])

  return <div ref={host} className={className} />
}
