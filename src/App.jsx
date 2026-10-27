import { useCallback, useEffect, useRef, useState } from 'react'
import IntroLoader from './IntroLoader'
import { AnimatePresence, motion, MotionConfig, useMotionValue, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Download, Menu, Moon, Sun, X, Mail, Compass, Layers, Code2, GraduationCap } from 'lucide-react'
import { FaLinkedinIn as Linkedin, FaInstagram as Instagram } from 'react-icons/fa'
import { SiCss, SiHtml5, SiPhp, SiMysql, SiDocker, SiLinux, SiFigma, SiFramer, SiGit, SiGithub, SiJavascript, SiNextdotjs, SiNodedotjs, SiReact, SiTypescript } from 'react-icons/si'
import { profile, projects, services, stack, skillLevels } from './data'
import HeroScene from './HeroScene'

const ease = [0.22, 1, 0.36, 1]
const stackIcons = {
  CSS: SiCss,
  PHP: SiPhp,
  MySQL: SiMysql,
  Docker: SiDocker,
  Linux: SiLinux,
  HTML: SiHtml5,
  React: SiReact,
  'Next.js': SiNextdotjs,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  'Node.js': SiNodedotjs,
  Figma: SiFigma,
  'Framer Motion': SiFramer,
  Git: SiGit,
}

const technologyColors = { JavaScript: '#f7df1e', CSS: '#51a5ff', HTML: '#ff865a', PHP: '#b4a7ff', MySQL: '#edb265', React: '#61dafb', TypeScript: '#60a5fa', 'Next.js': '#bfc4cf', 'Node.js': '#8bd66f' }

function TiltCard({ children, className = '' }) {
  const reduced = useReducedMotion()
  const rx = useSpring(0, { stiffness: 180, damping: 22 })
  const ry = useSpring(0, { stiffness: 180, damping: 22 })
  function move(e) {
    if (reduced || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    rx.set(-(e.clientY - r.top - r.height / 2) / r.height * 9)
    ry.set((e.clientX - r.left - r.width / 2) / r.width * 9)
  }
  return <motion.div className={className} onPointerMove={move} onPointerLeave={() => { rx.set(0); ry.set(0) }} style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}>{children}</motion.div>
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function MagneticLink({ children, className = '', ...props }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 250, damping: 20 })
  const springY = useSpring(y, { stiffness: 250, damping: 20 })

  function move(event) {
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18)
  }

  return (
    <motion.a
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={move}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      {...props}
    >
      {children}
    </motion.a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('kaio-theme') || 'dark')
  const links = [['Sobre', '#sobre'], ['Projetos', '#projetos'], ['Serviços', '#servicos'], ['Contato', '#contato']]

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('kaio-theme', theme)
  }, [theme])

  return (
    <header className={`header ${open ? 'menu-open' : ''}`}>
      <a className="logo" href="#inicio" aria-label="Voltar ao início">Kaio Amim<span>✦</span></a>
      <nav className="desktop-nav" aria-label="Navegação principal">
        {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'} title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={theme} initial={{ opacity: 0, rotate: -45, scale: .6 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 45, scale: .6 }} transition={{ duration: .2 }}>
              {theme === 'dark' ? <Sun /> : <Moon />}
            </motion.span>
          </AnimatePresence>
        </button>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.55, ease }}>
            <span className="eyebrow">Navegação</span>
            {links.map(([label, href], index) => (
              <motion.a key={href} href={href} onClick={() => setOpen(false)} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + index * .06 }}>{label}<ArrowUpRight /></motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Hero() {


  return (
    <section className="hero" id="inicio">
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="hero-topline">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }}>{profile.location}</motion.p>
        <motion.p className="availability" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65 }}><span /> {profile.availability}</motion.p>
      </div>
      <div className="hero-composition">
      <div className="hero-copy">
        <div className="hero-kicker">
          <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .8, ease }} />
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}>DESIGN MEETS DEVELOPMENT</motion.p>
        </div>
        <h1 aria-label="Ideias em código. Experiências que ficam.">
          {['Ideias em código.', 'Experiências', 'que ficam.'].map((line, index) => (
            <span className={index === 2 ? 'hero-accent' : ''} key={line}>
              <motion.i initial={{ y: '115%' }} animate={{ y: 0 }} transition={{ duration: .9, delay: .08 + index * .12, ease }}>{line}</motion.i>
            </span>
          ))}
        </h1>
        <motion.div className="hero-intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55 }}>
          <p className="hero-name">{profile.name} <span>/ {profile.role}</span></p>
          <p className="hero-description">Interfaces com personalidade. Código com propósito.<br />Transformo sua próxima ideia em uma experiência digital.</p>
        </motion.div>
        <div className="hero-actions">
          <a className="hero-cta primary" href="#contato">Vamos conversar <ArrowUpRight /></a>
          <a className="hero-cta secondary" href="#projetos">Ver projetos <ArrowUpRight /></a>
        </div>

      </div>
      <div className="hero-art">
        <div className="art-cross cross-top">+</div><div className="art-cross cross-bottom">+</div>
        <HeroScene />

        <span className="art-hint"><i /> Segure e arraste para girar</span>
      </div>
      </div>
      <div className="hero-footer">
        <div className="hero-socials"><a href={profile.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn de Kaio"><Linkedin /></a><a href={profile.social.github} target="_blank" rel="noreferrer" aria-label="GitHub de Kaio"><SiGithub /></a></div>
        <p>DESIGN COM INTENÇÃO. DESENVOLVIMENTO COM PRECISÃO.</p>
        <a href="#projetos" className="scroll-link"><span>Ver projetos</span><ArrowDown /></a>
      </div>
    </section>
  )
}

function ProjectCover({ project }) {
  const details = {
    '01': { label: 'GESTÃO DE ESTOQUE', title: 'UniStock', steps: ['Cadastro', 'Estoque', 'Controle'], glyph: '▦' },
    '02': { label: 'EXPLORADOR DE POKÉMON', title: 'Pokédex', steps: ['Buscar', 'Explorar', 'Descobrir'], glyph: '◎' },
    '03': { label: 'E-COMMERCE ACADÊMICO', title: 'Doceria', steps: ['Catálogo', 'Carrinho', 'Pedido'], glyph: '✦' },
    '04': { label: 'CONTROLE FINANCEIRO', title: 'Gerenciamento de gastos', steps: ['Registrar', 'Acompanhar', 'Planejar'], glyph: '↗' },
  }[project.number]
  return <div className={`editorial-cover editorial-${project.number}`} aria-hidden="true"><span className="editorial-category">{details.label}</span><div className="editorial-symbol">{details.glyph}</div><strong>{details.title}</strong><div className="editorial-flow">{details.steps.map((step,i)=><span key={step}>{step}{i<2 && <i>→</i>}</span>)}</div><small>PROJETO {project.number} / {project.tags.includes('PHP') ? 'FULL STACK' : 'FRONT-END'}</small></div>
}

function ProjectCard({ project }) {
  return <TiltCard className="work-card"><article>
    <ProjectCover project={project} />
    <div className="work-copy"><div className="work-meta"><span className="work-number">{project.number} / {project.category}</span><div className="work-tags">{project.tags.map(tag => { const Icon = stackIcons[tag]; return <span key={tag} style={{ '--tag-color': technologyColors[tag] || '#c4a5ff' }} title={tag} aria-label={tag}>{Icon ? <Icon /> : tag}</span> })}</div></div>
      <h3>{project.title}</h3><p>{project.description}</p><a className="work-link" href={project.liveUrl} target="_blank" rel="noreferrer">Ver site <ArrowUpRight /></a>
    </div>
  </article></TiltCard>
}

function Projects() {
  const [filter, setFilter] = useState('Todos')
  const [position, setPosition] = useState(1)
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [focused, setFocused] = useState(false)
  const reduced = useReducedMotion()
  const rail = useRef(null)
  const filtered = projects.filter(p => filter === 'Todos' || (p.tags.includes('PHP') ? 'Full stack' : 'Front-end') === filter)
  function navigate(direction) {
    const el = rail.current
    if (!el) return
    const step = (el.querySelector('.work-slot')?.getBoundingClientRect().width || 350) + 24
    const max = el.scrollWidth - el.clientWidth
    const target = direction > 0 && el.scrollLeft >= max - 4 ? 0 : direction < 0 && el.scrollLeft <= 4 ? max : el.scrollLeft + step * direction
    el.scrollTo({ left: target, behavior: reduced ? 'instant' : 'smooth' })
  }
  useEffect(() => {
    if (paused || interacting || focused || reduced) return
    const timer = setInterval(() => {
      const el = rail.current
      if (document.hidden || !el) return
      const bounds = el.getBoundingClientRect()
      if (bounds.bottom > 0 && bounds.top < innerHeight) navigate(1)
    }, 5500)
    return () => clearInterval(timer)
  }, [paused, interacting, focused, reduced, filter])
  return <section className="projects section-pad" id="projetos">
    <Reveal className="section-heading"><div><span className="eyebrow">02 — Projetos selecionados</span><h2>Ideias que ganharam<br /><em>forma e função.</em></h2></div><p>Aplicações que desenvolvi para colocar o aprendizado em prática. Explore os projetos e visite cada site.</p></Reveal>
    <div className="work-toolbar"><div className="filter-pills" role="group" aria-label="Filtrar projetos por área">{['Todos', 'Full stack', 'Front-end'].map(tag => <button key={tag} aria-pressed={filter === tag} onClick={() => { setFilter(tag); setPosition(1); rail.current.scrollLeft = 0 }}>{tag}</button>)}</div></div>
    <div className="work-rail" ref={rail} onScroll={e => { const el = e.currentTarget; const step = (el.querySelector('.work-slot')?.getBoundingClientRect().width || 350) + 24; setPosition(Math.min(filtered.length, Math.round(el.scrollLeft / step) + 1)) }} tabIndex={0} aria-label="Carrossel de projetos" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false) }} onTouchStart={() => setPaused(true)}><AnimatePresence mode="popLayout">{filtered.map(project => <motion.div className="work-slot" key={project.title} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .94 }}><ProjectCard project={project} /></motion.div>)}</AnimatePresence></div>
    <div className="gallery-bottom"><div className="carousel-controls"><button onClick={() => setPaused(!paused)} aria-label={paused ? 'Retomar avanço automático' : 'Pausar avanço automático'} aria-pressed={paused}>{paused ? '▷' : 'Ⅱ'}</button><button onClick={() => navigate(-1)} aria-label="Projetos anteriores"><ArrowLeft /></button><span className="gallery-position" aria-live="polite">{String(position).padStart(2, '0')}<i>/ {String(filtered.length).padStart(2, '0')}</i></span><button onClick={() => navigate(1)} aria-label="Próximos projetos"><ArrowRight /></button></div></div>
  </section>
}

function TechnologyMarquee() {
  const [paused, setPaused] = useState(false)
  return <section className={`technology-marquee ${paused ? 'is-paused' : ''}`} aria-label="Tecnologias">
    <div className="technology-window"><div className="technology-track">{[0, 1].map(copy => <div className="technology-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{stack.map(item => { const Icon = stackIcons[item]; return <span className="technology-logo" key={item} title={item} role="img" aria-label={item}><Icon /><i aria-hidden="true">✦</i></span> })}</div>)}</div></div>
    <button className="marquee-pause" onClick={() => setPaused(!paused)} aria-label={paused ? 'Retomar letreiro' : 'Pausar letreiro'}>{paused ? '▷' : 'Ⅱ'}</button>
  </section>
}

function SkillPanel() {
  return <section className="skills-panel"><div className="skills-heading"><span className="eyebrow">Ferramentas & tecnologias</span><h3>Conhecimento em prática.</h3><p>Níveis estimados pelo uso nos projetos e na experiência profissional.</p></div><div className="skill-grid">{skillLevels.map(skill => { const Icon = stackIcons[skill.name]; return <div className="skill-row" key={skill.name}><div className="skill-title"><span><Icon />{skill.name}</span><small>{skill.level}</small></div><div className="skill-meter" aria-label={`${skill.name}: ${skill.level}`}>{[1, 2, 3].map(n => <i key={n} className={n <= skill.stage ? 'filled' : ''} />)}</div><p>{skill.detail}</p></div> })}</div><div className="skill-legend"><span>01 / Básico</span><span>02 / Intermediário</span><span>03 / Avançado</span></div><TechnologyMarquee /></section>
}

function About() {
  const [category, setCategory] = useState('academica')
  const reduced = useReducedMotion()
  const categories = [['academica', 'Acadêmica'], ['profissional', 'Profissional'], ['extracurricular', 'Extracurricular']]
  const entries = {
    academica: profile.academic,
    profissional: profile.experiences.map(job => ({ title: job.company, subtitle: job.role, period: job.period || 'Período a informar', description: job.description, ongoing: job.period.includes('atual') })),
    extracurricular: profile.extracurricular || [],
  }
  return <section className="about" id="sobre">
    <div className="about-sticky"><span className="eyebrow">01 — Sobre mim</span><h2>Aprender. Construir.<br /><em>Continuar evoluindo.</em></h2><p>Kaio Amim / Sistemas de Informação</p><a className="hero-cta secondary about-resume" href="/curriculo-kaio-dev.pdf" download>Baixar currículo <Download /></a></div>
    <div className="about-person"><div className="profile-photo">{profile.photo ? <img src={profile.photo} alt="Kaio Amim" /> : <div className="photo-placeholder"><span>KA</span><small>Minha foto chega em breve.</small></div>}</div><p className="about-text">{profile.about}</p></div>
    <div className="journey-filters filter-pills" role="group" aria-label="Filtrar trajetória">{categories.map(([value, label]) => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{label}</button>)}</div>
    <div className="journey-stage">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={category} className="journey-panel" initial={{ opacity: 0, rotateY: reduced ? 0 : -22, z: reduced ? 0 : -90 }} animate={{ opacity: 1, rotateY: 0, z: 0 }} exit={{ opacity: 0, rotateY: reduced ? 0 : 22, z: reduced ? 0 : -90 }} transition={{ duration: reduced ? .1 : .4, ease }} aria-live="polite">
          {entries[category].length ? <div className="career-timeline">{entries[category].map((entry, index) => <div className="timeline-entry" key={entry.title}><span className="timeline-node" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><article><span className="eyebrow">{entry.period}</span><h3>{entry.title}</h3>{(entry.ongoing || entry.description?.includes('em andamento')) && <span className="ongoing-tag"><i /> {category === 'profissional' ? 'Atualmente' : 'Em andamento'}</span>}{entry.subtitle && <p>{entry.subtitle}</p>}{entry.description && <p>{entry.description}</p>}</article></div>)}</div> : <div className="journey-empty"><GraduationCap /><h3>Aprendizado além da sala de aula.</h3><p>Cursos, certificados e atividades serão adicionados aqui.</p></div>}
        </motion.div>
      </AnimatePresence>
    </div>
    {profile.careerPlan && <div className="career-plan"><span className="eyebrow">Próximos passos</span><p>{profile.careerPlan}</p></div>}
    <SkillPanel />
  </section>
}

function ServiceVisual({ step }) {
  const labels = ['Encontre a direção.', 'Dê forma à ideia.', 'Construa a experiência.', 'Conecte com o mundo.']
  return <div className={`process-emblem emblem-${step}`} aria-hidden="true">
    <svg viewBox="0 0 300 260" fill="none" className="emblem-svg">
      <defs><linearGradient id={`emblem-fill-${step}`} x1="40" y1="30" x2="260" y2="235" gradientUnits="userSpaceOnUse"><stop stopColor="#d4adff" stopOpacity=".25"/><stop offset="1" stopColor="#6d32b7" stopOpacity=".04"/></linearGradient></defs>
      <ellipse cx="150" cy="225" rx="85" ry="12" fill="#9455f5" opacity=".07"/>
      <g className="emblem-orbit" stroke="#a16aff" strokeOpacity=".16"><circle cx="150" cy="120" r="102" strokeDasharray="2 9"/><path d="M34 120H55M245 120H266M150 4V25M150 215V236"/></g>
      <g className="emblem-object" stroke="#c99aff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {step === 0 && <>
        <path d="M65 69L35 49M231 80L261 54M226 178L260 199M77 182L40 210" strokeOpacity=".4"/>
        <circle cx="35" cy="49" r="5"/><circle cx="261" cy="54" r="5"/><circle cx="260" cy="199" r="5"/><circle cx="40" cy="210" r="5"/>
        <circle cx="150" cy="120" r="80" fill="url(#emblem-fill-0)"/><circle cx="150" cy="120" r="67" strokeOpacity=".35"/>
        <path d="M150 48V59M150 181V192M78 120H89M211 120H222M99 69L107 77M193 163L201 171M99 171L107 163M193 77L201 69"/>
        <g className="compass-needle"><path d="M174 79L164 134 126 161 136 106Z" fill="#a368ee" fillOpacity=".25"/><path d="M174 79L150 120 136 106Z" fill="#d4b0ff"/><path d="M126 161L150 120 164 134Z" fill="#66359e"/><circle cx="150" cy="120" r="5" fill="#20152e"/></g>
      </>}
      {step === 1 && <>
        <path d="M65 69H156L191 103V207H65Z" fill="url(#emblem-fill-1)" strokeOpacity=".6"/><path d="M156 69V103H191M84 131H124M84 149H138M84 168H115M84 187H148" strokeOpacity=".3"/>
        <g transform="rotate(35 184 109)"><path d="M170 47Q170 39 184 39Q198 39 198 47V154L184 181 170 154Z" fill="#24172f"/><path d="M170 62H198V151H170Z" fill="url(#emblem-fill-1)"/><path d="M178 65V149M190 65V149M170 56H198M170 151H198"/><path d="M179 171L184 181 189 171" fill="#d9b7ff"/><path d="M198 68H207V105" strokeWidth="3"/></g>
        <path d="M201 195Q224 171 244 187M226 67V53M219 60H233" strokeOpacity=".6"/>
      </>}
      {step === 2 && <>
        <path d="M66 59Q66 50 75 50H225Q234 50 234 59V174H66Z" fill="url(#emblem-fill-2)"/>
        <path d="M77 64H223V163H77Z" fill="#18141f"/><circle cx="150" cy="57" r="1.5" fill="#c99aff"/>
        <path d="M66 174L42 204Q40 211 49 212H251Q260 211 258 204L234 174Z" fill="url(#emblem-fill-2)"/><path d="M42 204H258M126 190H174L180 199H120Z" strokeOpacity=".5"/>
        <path d="M121 96L103 112 121 128M179 96L197 112 179 128M158 90L142 134" strokeWidth="3" stroke="#dab7ff"/>
        <path d="M90 150H125M134 150H165" strokeOpacity=".35"/><circle cx="210" cy="150" r="3" fill="#bc85ff"/>
      </>}
      {step === 3 && <>
        <circle cx="150" cy="116" r="72" fill="url(#emblem-fill-3)"/>
        <g className="globe-lines"><ellipse cx="150" cy="116" rx="33" ry="72"/><ellipse cx="150" cy="116" rx="59" ry="72" strokeOpacity=".3"/><ellipse cx="150" cy="116" rx="72" ry="27"/><path d="M150 44V188M78 116H222M92 73Q150 102 208 73M92 159Q150 130 208 159" strokeOpacity=".6"/></g>
        <ellipse cx="150" cy="116" rx="109" ry="36" transform="rotate(-30 150 116)" stroke="#ad72ef" strokeOpacity=".7"/>
        <circle className="globe-node" cx="241" cy="64" r="6" fill="#d8b3ff"/><circle cx="97" cy="153" r="4" fill="#c99aff"/>
        <path d="M126 190V208H174V190M110 216H190" strokeOpacity=".4"/>
        <path d="M220 173H244V197H220Z" fill="#251831"/><path d="M225 185L230 190 239 179" strokeWidth="2"/>
      </>}
      </g>
    </svg>
    <span>{labels[step]}</span>
  </div>
}

function Services() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const stages = [
    { label: 'Descobrir', progress: 10, title: 'Entender antes de desenhar.', text: 'Alinhamos sua ideia, o público e as prioridades. Um ponto de partida claro para tomar boas decisões.', tags: ['Briefing', 'Objetivos', 'Direção'], icon: Compass },
    { label: 'Desenhar', progress: 50, title: 'Dar forma à experiência.', text: 'Organizamos os fluxos e criamos a interface. Você participa da validação antes de transformar o protótipo em código.', tags: ['Fluxos', 'Protótipo', 'Validação'], icon: Layers },
    { label: 'Desenvolver', progress: 80, title: 'Transformar a ideia em produto.', text: 'Implementamos as funcionalidades, refinamos as interações e testamos o resultado em diferentes tamanhos de tela.', tags: ['Código', 'Integrações', 'Testes'], icon: Code2 },
    { label: 'Entregar', progress: 100, title: 'Publicar, ouvir e evoluir.', text: 'Revisamos os detalhes, colocamos o projeto no ar e reunimos seu feedback para os ajustes finais.', tags: ['Publicação', 'Feedback', 'Ajustes'], icon: Check },
  ]
  const current = stages[active]
  return <section className="services section-pad" id="servicos">
    <Reveal className="section-heading"><div><span className="eyebrow">03 — Como posso ajudar</span><h2>Da ideia à entrega.<br /><em>Um processo compartilhado.</em></h2></div><p>Explore as etapas do meu processo.<br />Os percentuais ilustram o caminho, não o prazo do projeto.</p></Reveal>
    <div className="process-progress-head"><span>PROCESSO / 0{active + 1} DE 04</span><strong>{current.progress}<small>%</small></strong></div>
    <div className="process-progress" role="progressbar" aria-label="Etapa ilustrativa do processo" aria-valuemin={0} aria-valuemax={100} aria-valuenow={current.progress} aria-valuetext={current.label + ' — ' + current.progress + '%'}><motion.div animate={{ width: current.progress + '%' }} transition={{ duration: reduced ? 0 : .7, ease }} /></div>
    <div className="process-track process-four" style={{ '--completed': `${active / 3 * 100}%` }} role="group" aria-label="Etapas do projeto">{stages.map((stage,index)=>{ const Icon = stage.icon; return <button key={stage.label} aria-pressed={active === index} onClick={()=>setActive(index)} className={index < active ? 'stage-complete' : ''}><span className="process-dot"><Icon /></span><small>{stage.progress}%</small><strong>{stage.label}</strong></button> })}</div>
    <div className="process-stage"><AnimatePresence mode="wait" initial={false}><motion.div key={active} initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}><div className="process-detail"><ServiceVisual step={active} /><div><span className="eyebrow">0{active+1} — {current.label}</span><h3>{current.title}</h3><p>{current.text}</p><div className="process-tags">{current.tags.map(tag=><span key={tag}>{tag}</span>)}</div><button className="process-advance" onClick={()=>setActive((active+1)%4)}>{active === 3 ? 'Rever processo' : 'Próxima etapa'} <ArrowRight /></button></div></div></motion.div></AnimatePresence></div>
  </section>
}

function Contact() {
  const [copyStatus, setCopyStatus] = useState('')
  const email = profile.email
  async function copyEmail() {
    try { await navigator.clipboard.writeText(email); setCopyStatus('E-mail copiado!') }
    catch { setCopyStatus('Não foi possível copiar. Selecione o e-mail abaixo.') }
  }
  const links = [
    { label: 'GitHub', icon: SiGithub, url: profile.social.github, detail: 'Código & projetos' },
    { label: 'LinkedIn', icon: Linkedin, url: profile.social.linkedin, detail: 'Minha trajetória' },
    { label: 'Instagram', icon: Instagram, url: profile.social.instagram, detail: 'Além do código' },
    { label: 'E-mail', icon: Mail, url: email ? `mailto:${email}` : '', detail: email || 'Endereço em atualização' },
  ]
  return <footer className="contact contact-redesign" id="contato">

    <div className="contact-panel">
      <Reveal className="contact-invitation"><span className="eyebrow">04 — Vamos conversar</span><span className="contact-status"><i /> Aberto a novas conexões</span><h2>Seu próximo projeto<br />começa com uma<br /><em>boa conversa.</em></h2><p>Uma ideia, uma oportunidade ou só um olá.<br />Escolha onde a gente se encontra.</p>{email ? <a className="conversation-button" href={`mailto:${email}`}>Me conte sua ideia <ArrowUpRight /></a> : <a className="conversation-button" href="#contact-channels">Encontre meu perfil <ArrowDown /></a>}</Reveal>
      <div className="contact-channels" id="contact-channels">{links.map(({ label, icon: Icon, url, detail }) => url ? <a className="contact-channel" key={label} href={url} target={label === 'E-mail' ? undefined : '_blank'} rel="noreferrer"><span className="channel-icon"><Icon /></span><span><strong>{label}</strong><small>{detail}</small></span><ArrowUpRight /></a> : <div className="contact-channel channel-pending" key={label}><span className="channel-icon"><Icon /></span><span><strong>{label}</strong><small>Perfil em atualização</small></span><span className="pending-dot" /></div>)}
        {email && <button className="contact-copy" onClick={copyEmail}><Copy /> Copiar endereço de e-mail</button>}<p className="copy-status" role="status">{copyStatus}</p>
      </div>
    </div>
    <div className="footer-bottom"><span>Kaio Amim / Portfolio</span><p>© {new Date().getFullYear()} · Design & código</p><a href="#inicio">Voltar ao topo ↑</a></div>
  </footer>
}

function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0, x = 0, y = 0
    const move = e => {
      x = e.clientX; y = e.clientY
      if (!frame) frame = requestAnimationFrame(() => {
        if (ref.current) { ref.current.style.transform = `translate3d(${x - 150}px, ${y - 150}px, 0)`; ref.current.style.opacity = '1' }
        frame = 0
      })
    }
    const hide = () => { if (ref.current) ref.current.style.opacity = '0' }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', hide); window.removeEventListener('blur', hide) }
  }, [])
  return <div className="cursor-glow" ref={ref} aria-hidden="true" />
}

function App() {
  const [ready, setReady] = useState(false)
  const finishIntro = useCallback(() => setReady(true), [])
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: .001 })

  return (
    <>
      <IntroLoader onReady={finishIntro} />
      <CursorGlow />
      <div inert={!ready}>
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <Header />
      <MotionConfig reducedMotion="user"><main><Hero /><About /><Projects /><Services /></main>
      <Contact /></MotionConfig>
      </div>
    </>
  )
}

export default App
