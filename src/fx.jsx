import { useEffect, useRef, useState } from 'react'
import {
  motion, useMotionValue, useMotionTemplate, useSpring, useTransform, useReducedMotion,
} from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1]

/* ---- shared variants: scale 0.95 -> 1 + slide ---- */
export const stagger = (gap = 0.1, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})
export const rise = {
  hidden: { opacity: 0, scale: 0.95, y: 24 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease } },
}
export const slideIn = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
}

export function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/* ---- drifting dot matrix (transform-only => compositor, 60fps) ---- */
function DotLayer({ bright = false, style }) {
  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={style}>
      <div className={bright ? 'dot-field dot-field-bright' : 'dot-field'} />
    </motion.div>
  )
}

/* ---- cursor spotlight + trailing ring + dots that light up near cursor ---- */
export function AmbientLayer() {
  const reduce = useReducedMotion()
  const [fine, setFine] = useState(false)
  const x = useMotionValue(-600)
  const y = useMotionValue(-600)
  const sx = useSpring(x, { stiffness: 140, damping: 26, mass: 0.7 })
  const sy = useSpring(y, { stiffness: 140, damping: 26, mass: 0.7 })
  const rx = useSpring(x, { stiffness: 380, damping: 32 })
  const ry = useSpring(y, { stiffness: 380, damping: 32 })

  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches)
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  const spot = useMotionTemplate`radial-gradient(560px circle at ${sx}px ${sy}px, rgba(52,211,153,0.065), transparent 70%)`
  const mask = useMotionTemplate`radial-gradient(200px circle at ${sx}px ${sy}px, black, transparent)`

  return (
    <>
      <DotLayer />
      {fine && !reduce && (
        <>
          <DotLayer bright style={{ maskImage: mask, WebkitMaskImage: mask }} />
          <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-30" style={{ background: spot }} />
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-30 h-7 w-7 -ml-3.5 -mt-3.5 rounded-full border border-emerald-400/40"
            style={{ x: rx, y: ry }}
          />
        </>
      )}
    </>
  )
}

/* ---- card: glowing border that follows cursor, optional 3D tilt ---- */
export function TiltCard({ children, className = '', tilt = 4, bordered = true, as = 'div', variants }) {
  const reduce = useReducedMotion()
  const max = reduce ? 0 : tilt
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const mx = useMotionValue(-300)
  const my = useMotionValue(-300)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 220, damping: 24 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 220, damping: 24 })

  const glow = useMotionTemplate`radial-gradient(280px circle at ${mx}px ${my}px, rgba(52,211,153,0.10), transparent 70%)`
  const edge = useMotionTemplate`radial-gradient(170px circle at ${mx}px ${my}px, black, transparent)`

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - r.left); my.set(e.clientY - r.top)
    px.set((e.clientX - r.left) / r.width); py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => { px.set(0.5); py.set(0.5); mx.set(-300); my.set(-300) }

  const Tag = motion[as]
  return (
    <Tag
      variants={variants}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`relative ${bordered ? 'border border-zinc-800' : ''} ${className}`}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      {bordered && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px border border-emerald-400/70"
          style={{ maskImage: edge, WebkitMaskImage: edge }}
        />
      )}
      {children}
    </Tag>
  )
}

/* ---- skill badge: magnetic pull + light spring overshoot ---- */
export function MagneticBadge({ children }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 320, damping: 15, mass: 0.5 })
  const y = useSpring(my, { stiffness: 320, damping: 15, mass: 0.5 })
  const ref = useRef(null)
  const clamp = (v) => Math.max(-8, Math.min(8, v))

  return (
    <motion.li
      ref={ref}
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } },
      }}
      whileHover={reduce ? undefined : { scale: 1.06 }}
      onPointerMove={(e) => {
        if (reduce) return
        const r = ref.current.getBoundingClientRect()
        mx.set(clamp((e.clientX - (r.left + r.width / 2)) * 0.35))
        my.set(clamp((e.clientY - (r.top + r.height / 2)) * 0.5))
      }}
      onPointerLeave={() => { mx.set(0); my.set(0) }}
      style={{ x, y }}
      className="cursor-default border border-zinc-800 px-2.5 py-1 font-mono text-xs text-zinc-400 transition-colors duration-200 hover:border-emerald-400/60 hover:text-emerald-400"
    >
      {children}
    </motion.li>
  )
}
