import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { profile, experience, education, highlights, skills } from './data'
import { ease, stagger, rise, slideIn, Reveal, AmbientLayer, TiltCard, MagneticBadge } from './fx'

/* ---------- helpers ---------- */
function SectionTitle({ id, children }) {
  return (
    <Reveal>
      <h2 id={id} className="font-mono text-sm text-emerald-400">{children}</h2>
    </Reveal>
  )
}

/* ---------- typing hook ---------- */
function useTyping(lines, { speed = 22, pause = 450 } = {}) {
  const [out, setOut] = useState([''])
  useEffect(() => {
    let cancelled = false
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    ;(async () => {
      for (let i = 0; i < lines.length; i++) {
        for (let c = 1; c <= lines[i].length; c++) {
          if (cancelled) return
          setOut((prev) => { const n = [...prev]; n[i] = lines[i].slice(0, c); return n })
          await sleep(speed)
        }
        if (i < lines.length - 1) setOut((prev) => [...prev, ''])
        await sleep(pause)
      }
    })()
    return () => { cancelled = true }
  }, []) // eslint-disable-line
  return out
}

/* ---------- terminal widget ---------- */
const TERMINAL_LINES = [
  '$ whoami',
  'najya — mobile + backend engineer',
  '$ cat stack.yaml',
  'mobile:  [flutter, dart, clean-arch]',
  'backend: [go, laravel, odoo-api]',
  'data:    [postgresql, mysql]',
  'infra:   [docker, gcp]',
  '$ stats --career',
  'production_apps: 3   # AdolPOS, AdolESS, BNI mobile',
  'gpa: 3.81/4.00   patent: 1   students_mentored: 70+',
  '$ status',
  'open_to_work: true',
]

function Terminal() {
  const lines = useTyping(TERMINAL_LINES)
  const lastIdx = lines.length - 1
  const colorFor = (l) =>
    l.startsWith('$') ? 'text-emerald-400' : l.startsWith('open_to_work') ? 'text-zinc-100' : 'text-zinc-400'

  return (
    <div className="border border-zinc-800 bg-zinc-950/80 rounded-md overflow-hidden font-mono text-[12.5px] leading-6">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 text-xs text-zinc-500">
        <span>~/najya/profile.sh</span>
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2 w-2 rounded-full bg-zinc-800" />
          <i className="h-2 w-2 rounded-full bg-zinc-800" />
          <i className="h-2 w-2 rounded-full bg-zinc-800" />
        </span>
      </div>
      <div className="p-4 min-h-[330px] whitespace-pre-wrap break-words" aria-label="Ringkasan teknis dalam bentuk terminal">
        {lines.map((l, i) => (
          <div key={i} className={`${colorFor(l)} ${i === lastIdx ? 'caret' : ''}`}>{l || '\u00A0'}</div>
        ))}
      </div>
    </div>
  )
}

/* ---------- nav ---------- */
function Nav() {
  const links = [['experience', 'experience'], ['highlights', 'highlights'], ['skills', 'skills'], ['contact', 'contact']]
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 font-mono text-xs">
        <a href="#top" className="text-zinc-100 hover:opacity-70 transition-opacity">najya.dev</a>
        <nav className="flex gap-5 text-zinc-500">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="hover:text-emerald-400 transition-colors">{label}</a>
          ))}
        </nav>
      </div>
    </header>
  )
}

/* ---------- hero ---------- */
function Hero() {
  const reduce = useReducedMotion()
  const item = (d) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease, delay: d },
  })
  return (
    <section id="top" className="relative">
      <div className="relative mx-auto grid max-w-5xl gap-12 px-6 pb-24 pt-20 md:grid-cols-[1.1fr_1fr] md:items-center md:pt-28">
        <div>
          <motion.div {...item(0)} className="inline-flex items-center gap-2 border border-zinc-800 px-3 py-1 font-mono text-xs text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            🟢 AVAILABLE FOR WORK
          </motion.div>

          <motion.h1 {...item(0.12)} className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight text-zinc-50 sm:text-6xl">
            Najya
            <br />
            Anastasya
          </motion.h1>

          <motion.p {...item(0.24)} className="mt-6 max-w-md text-lg leading-relaxed text-zinc-400">
            Mobile developer yang membangun fitur perbankan dengan Flutter dan sistem backend dengan Go. Berbasis di Jakarta.
          </motion.p>

          <motion.div {...item(0.36)} className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
            <a href={`mailto:${profile.email}`} className="border border-emerald-400/60 px-4 py-2 text-emerald-400 transition-colors hover:bg-emerald-400/10">
              Kirim email
            </a>
            <a href="#experience" className="border border-zinc-800 px-4 py-2 text-zinc-300 transition-colors hover:border-zinc-600">
              Lihat pengalaman
            </a>
          </motion.div>
        </div>

        <motion.div {...item(0.3)}>
          <Terminal />
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- experience ---------- */
function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-20" aria-labelledby="exp-title">
      <SectionTitle id="exp-title">// experience</SectionTitle>

      <div className="mt-10 ml-1.5 border-l border-dashed border-zinc-800">
        {experience.map((job, i) => (
          <motion.div
            key={job.company}
            className="relative pb-8 pl-8 last:pb-0"
            variants={stagger(0.1, 0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <span className={`absolute -left-[5px] top-6 h-2.5 w-2.5 border ${i === 0 ? 'border-emerald-400 bg-emerald-400' : 'border-zinc-600 bg-zinc-950'}`} />
            <TiltCard as="article" variants={rise} className="p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-xl font-semibold text-zinc-100">{job.role}</h3>
                <span className="font-mono text-xs text-zinc-500">{job.period}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                {job.company} <span className="text-zinc-600">/ {job.place}</span>
              </p>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-zinc-400">
                {job.points.map((p) => (
                  <motion.li key={p} variants={slideIn} className="flex gap-3">
                    <span className="mt-2.5 h-px w-3 shrink-0 bg-zinc-700" aria-hidden="true" />
                    <span>{p}</span>
                  </motion.li>
                ))}
              </ul>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      <Reveal className="mt-14">
        <TiltCard className="p-5" tilt={3}>
          <p className="font-mono text-xs text-zinc-500">{education.period}</p>
          <h3 className="mt-1 font-semibold text-zinc-100">{education.school}</h3>
          <p className="text-sm text-zinc-400">{education.degree}</p>
          <p className="mt-2 font-mono text-xs text-emerald-400">GPA {education.gpa}</p>
        </TiltCard>
      </Reveal>
    </section>
  )
}

/* ---------- highlights ---------- */
function Highlights() {
  return (
    <section id="highlights" className="mx-auto max-w-5xl px-6 py-20" aria-labelledby="hl-title">
      <SectionTitle id="hl-title">// projects & achievements</SectionTitle>
      <motion.div
        className="mt-10 grid gap-px overflow-hidden border border-zinc-800 bg-zinc-800 sm:grid-cols-2"
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        {highlights.map((h) => (
          <TiltCard key={h.title} as="article" variants={rise} bordered={false} tilt={0} className="group overflow-hidden bg-zinc-950 p-7">
            <p className="font-mono text-xs text-zinc-600 transition-colors group-hover:text-emerald-400">{h.tag}</p>
            <h3 className="mt-3 text-lg font-semibold text-zinc-100 transition-transform duration-300 group-hover:translate-x-0.5">{h.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">{h.body}</p>
          </TiltCard>
        ))}
      </motion.div>
    </section>
  )
}

/* ---------- skills ---------- */
function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20" aria-labelledby="sk-title">
      <SectionTitle id="sk-title">// skills</SectionTitle>
      <motion.ul
        className="mt-10 flex flex-wrap gap-2"
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        {skills.map((s) => <MagneticBadge key={s}>{s}</MagneticBadge>)}
      </motion.ul>
    </section>
  )
}

/* ---------- contact ---------- */
function Contact() {
  const rows = [
    ['email', profile.email, `mailto:${profile.email}`],
    ['phone', profile.phone, `tel:${profile.phone}`],
    ['linkedin', 'LinkedIn', profile.linkedin],
    ['github', 'GitHub', profile.github],
  ]
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 pb-24 pt-20" aria-labelledby="ct-title">
      <SectionTitle id="ct-title">// contact</SectionTitle>
      <Reveal className="mt-10">
        <h2 className="max-w-lg text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          Punya produk mobile atau backend yang perlu dikerjakan?
        </h2>
        <dl className="mt-8 divide-y divide-zinc-800 border-y border-zinc-800 font-mono text-sm">
          {rows.map(([k, label, href]) => (
            <div key={k} className="grid grid-cols-[90px_1fr] py-3">
              <dt className="text-zinc-600">{k}</dt>
              <dd>
                <a href={href} className="text-zinc-300 transition-opacity hover:opacity-70 break-all">{label}</a>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      <AmbientLayer />
      <div className="relative z-10">
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Highlights />
        <Skills />
        <Contact />
      </main>
      <footer className="border-t border-zinc-900 py-6 text-center font-mono text-xs text-zinc-600">
        © {new Date().getFullYear()} {profile.name} — {profile.location}
      </footer>
      </div>
    </div>
  )
}
