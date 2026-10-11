import * as React from "react"
import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

// The SuluSystems mark, extruded. The five rectangles are the exact glyph from
// sulusystems.kz/favicon.svg (512×512 box), so the 3D logo is the real brand mark.
const GLYPH: [number, number, number, number][] = [
  [192, 81, 128, 42],
  [192, 123, 42, 112],
  [192, 235, 64, 42],
  [278, 235, 42, 154],
  [192, 389, 128, 42],
]

export function LogoScene({ className, label }: { className?: string; label: string }) {
  const host = React.useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  React.useEffect(() => {
    const el = host.current
    if (!el) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    el.appendChild(renderer.domElement)
    renderer.domElement.setAttribute("aria-hidden", "true")

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    camera.position.set(0, 0, 9)

    const shapes = GLYPH.map(([x, y, w, h]) => {
      const s = new THREE.Shape()
      // SVG y grows downward; flip and centre on (256, 256), scale to ~3 units.
      const k = 1 / 100
      const x0 = (x - 256) * k
      const y0 = -(y - 256) * k
      s.moveTo(x0, y0)
      s.lineTo(x0 + w * k, y0)
      s.lineTo(x0 + w * k, y0 - h * k)
      s.lineTo(x0, y0 - h * k)
      s.closePath()
      return s
    })
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.035,
      bevelSegments: 4,
    })
    geo.center()
    const gold = new THREE.MeshStandardMaterial({ color: "#b8966e", metalness: 0.95, roughness: 0.28 })
    const mark = new THREE.Mesh(geo, gold)

    // Plate: the favicon's emerald square, as a thin rounded slab behind the mark.
    const plateShape = new THREE.Shape()
    const r = 0.5, half = 2.35
    plateShape.moveTo(-half + r, -half)
    plateShape.lineTo(half - r, -half)
    plateShape.quadraticCurveTo(half, -half, half, -half + r)
    plateShape.lineTo(half, half - r)
    plateShape.quadraticCurveTo(half, half, half - r, half)
    plateShape.lineTo(-half + r, half)
    plateShape.quadraticCurveTo(-half, half, -half, half - r)
    plateShape.lineTo(-half, -half + r)
    plateShape.quadraticCurveTo(-half, -half, -half + r, -half)
    const plateGeo = new THREE.ExtrudeGeometry(plateShape, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 4 })
    plateGeo.center()
    const plateMat = new THREE.MeshStandardMaterial({ color: "#1a4a3a", metalness: 0.35, roughness: 0.4 })
    const plate = new THREE.Mesh(plateGeo, plateMat)
    plate.position.z = -0.38

    const group = new THREE.Group()
    group.add(plate, mark)
    scene.add(group)

    const key = new THREE.DirectionalLight("#fff6e8", 1.6)
    key.position.set(3, 4, 6)
    scene.add(key, new THREE.AmbientLight("#ebf4f0", 0.3))

    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = "100%"
      renderer.domElement.style.height = "100%"
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    const target = { x: 0, y: 0 }
    const onPointer = (e: PointerEvent) => {
      const b = el.getBoundingClientRect()
      target.x = ((e.clientX - b.left) / b.width - 0.5) * 0.8
      target.y = ((e.clientY - b.top) / b.height - 0.5) * 0.6
    }
    window.addEventListener("pointermove", onPointer, { passive: true })

    const timer = new THREE.Timer()
    timer.connect(document)
    let visible = false
    let raf = 0
    const draw = () => {
      timer.update()
      const t = timer.getElapsed()
      group.rotation.y += (Math.sin(t * 0.6) * 0.55 + target.x - group.rotation.y) * 0.06
      group.rotation.x += (Math.sin(t * 0.4) * 0.12 + target.y - group.rotation.x) * 0.06
      group.position.y = Math.sin(t * 1.1) * 0.08
      renderer.render(scene, camera)
    }
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (visible && !document.hidden) draw()
    }
    if (reduced) draw()
    else loop()
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (reduced && visible) draw()
    })
    io.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      timer.dispose()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener("pointermove", onPointer)
      geo.dispose(); plateGeo.dispose(); gold.dispose(); plateMat.dispose(); envTex.dispose(); pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [reduced])

  return <div ref={host} className={className} role="img" aria-label={label} />
}
