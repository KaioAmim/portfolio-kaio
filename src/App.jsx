import { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, ArrowRight, ArrowUp, Github, Linkedin, Mail, Download, Menu, X, Pause, Play, MapPin, Code2, Database, Terminal, BriefcaseBusiness, GraduationCap, Award, Copy, Check, ExternalLink } from 'lucide-react';
import { profile, projects, skills, timeline } from './content';
import Carousel from './components/Carousel';
import Contact from './components/Contact';
import HeroScene from './components/HeroScene';
import Process from './components/Process';
import TransitionPanel from './components/TransitionPanel';
import Skills from './components/Skills';
import TechIcon, { tagColors } from './components/TechIcon';
import { BootScreen, CursorGlow, ThemeToggle } from './components/Experience';
const nav = [['inicio', 'Início'], ['projetos', 'Projetos'], ['sobre', 'Sobre mim'], ['contato', 'Contato']];
const external = { target: '_blank', rel: 'noopener noreferrer' };

function Brand() {
  return <a href="#inicio" className="brand" aria-label="Kaio Amim, início"><span className="brand-mark" aria-hidden="true">k<span>.</span></span><span>kaio amim<span className="brand-dot">.</span></span></a>;
}

function ProjectCard({ project, onDetails, reduced }) {
  const ref = useRef(null);
  const move = e => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--rx', `${-(e.clientY - r.top - r.height / 2) / r.height * 5}deg`);
    ref.current.style.setProperty('--ry', `${(e.clientX - r.left - r.width / 2) / r.width * 5}deg`);
  };
  const reset = () => { ref.current.style.setProperty('--rx', '0deg'); ref.current.style.setProperty('--ry', '0deg'); };
  return <article className={`project-card project-${project.id}`}>
    <button className="project-visual" ref={ref} onPointerMove={move} onPointerLeave={reset} onClick={() => onDetails(project)} aria-label={`Ver detalhes de ${project.title}`}>
      <img className="project-cover" src={project.cover} alt={`Capa ilustrada de ${project.title}`} loading="lazy" width="960" height="600"/>
      <span className="visual-arrow"><ArrowUpRight size={21} /></span>
    </button>
    <div className="project-card-body"><div className="project-meta"><span>{project.category}</span><div className="project-tags">{project.tags.map(tag => <span key={tag} className={`tech-tag tag-${tagColors[tag] || 'api'}`}><TechIcon name={tag} size={12}/>{tag}</span>)}</div></div>
    <h3><button onClick={() => onDetails(project)}>{project.title}</button></h3>
    <p>{project.subtitle}</p>
    <div className="project-links"><a className="project-link" href={project.url} {...external}>Ver site <ArrowUpRight size={16} /></a></div></div>
  </article>;
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!project) return;
    const dialog = ref.current;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; if (dialog.open) dialog.close(); };
  }, [project]);
  return <dialog className="project-dialog" ref={ref} onClose={onClose} onClick={e => { if (e.target === e.currentTarget) ref.current.close(); }} aria-labelledby="project-title">
    {project && <><button className="dialog-close icon-button" aria-label="Fechar detalhes" onClick={() => ref.current.close()} autoFocus><X size={22} /></button><img className="dialog-img" src={project.image} alt={`Site ${project.title}`} /><div className="dialog-body"><span className="section-kicker">{project.category}</span><h2 id="project-title">{project.title}</h2><p>{project.description}</p><ul>{project.details.map(item => <li key={item}>{item}</li>)}</ul><div className="dialog-actions"><a className="button button-primary" href={project.url} {...external}>Ver site <ExternalLink size={17} /></a></div></div></>}
  </dialog>;
}

export default function App() {
  const shell = useRef(null);
  const [booting, setBooting] = useState(true);
  const [loadProgress,setLoadProgress]=useState(0);
  const completed=useRef(new Set());
  const markLoaded=useCallback(key=>{completed.current.add(key);setLoadProgress(Math.min(100,Math.round(completed.current.size/6*100)));},[]);
  useEffect(()=>{let alive=true;document.fonts.ready.then(()=>{if(alive)markLoaded('fonts');});projects.forEach(project=>{const image=new Image();image.onload=image.onerror=()=>{if(alive)markLoaded(project.id);};image.src=project.cover;});const timeout=setTimeout(()=>{if(alive){['fonts','scene',...projects.map(p=>p.id)].forEach(markLoaded);}},7000);return()=>{alive=false;clearTimeout(timeout);};},[markLoaded]);
  useEffect(()=>{if(loadProgress<100)return;const timer=setTimeout(()=>setBooting(false),1800);return()=>clearTimeout(timer);},[loadProgress]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('inicio');
  const [projectFilter, setProjectFilter] = useState('Todos');
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [copyState, setCopyState] = useState('idle');
  const copyTimer = useRef();
  const menuButton = useRef(null);
  const isPaused = motionEnabled === null ? reduced : !motionEnabled;
  useEffect(() => { document.documentElement.dataset.motion = isPaused ? 'reduced' : 'full'; }, [isPaused]);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(query.matches);
    query.addEventListener('change', change);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
    return () => { query.removeEventListener('change', change); observer.disconnect(); clearTimeout(copyTimer.current); };
  }, []);
  useEffect(() => {
    const escape = event => { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); } };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [menuOpen]);
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopyState('copied'); }
    catch { setCopyState('failed'); }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState('idle'), 4000);
  };
  const visibleProjects = useMemo(() => projects.filter(project => projectFilter === 'Todos' || project.category === projectFilter), [projectFilter]);
  const filteredTimeline = timeline.filter(item => timelineFilter === 'all' || item.type === timelineFilter);
  const visibleTimeline = timelineExpanded ? filteredTimeline : filteredTimeline.slice(0, 4);

  return <>
    {booting && <BootScreen progress={loadProgress} onEnter={()=>setBooting(false)}/>}<CursorGlow reduced={isPaused}/><div className="site-shell" ref={shell} inert={booting}>
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
    <header className="site-header"><div className="container header-inner"><Brand /><nav className={menuOpen ? 'main-nav open' : 'main-nav'} id="main-nav" aria-label="Menu principal">{nav.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav><div className="header-actions"><ThemeToggle reduced={isPaused} shell={shell}/><a className="header-contact" href="#contato">Contato <ArrowUpRight size={16} /></a><button className="menu-toggle icon-button" ref={menuButton} aria-expanded={menuOpen} aria-controls="main-nav" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div></div></header>
    <main id="conteudo">
      <section className="hero container" id="inicio" aria-labelledby="hero-title">
        <div className="code-background" aria-hidden="true"><pre>{`class NeuralWorkspace {
  async connect(input) {
    const context = await model.encode(input);
    return agent.run({ context, tools });
  }
}

const stack = ["React", "Node.js", "PHP"];
const response = await api.get("/projects");`}</pre><pre>{`import { Brain, Network } from "ai";

function learn(data) {
  return data.map(node => ({
    ...node, connected: true
  }));
}

// human ideas, connected systems
network.connect();`}</pre></div><div className="hero-copy"><div className="hero-intro"><span className="small-line" /> Olá, eu sou Kaio Amim</div><h1 id="hero-title">Backend.<br />Web<span className="accent">.</span></h1><p className="hero-role">Desenvolvedor de software <span>Backend & Web</span></p><p className="hero-description">Desenvolvo aplicações com React, PHP e Node.js — da interface à API, da autenticação ao banco de dados.</p><div className="hero-actions"><a href="#projetos" className="button button-primary">Ver meus projetos <ArrowUpRight size={18} /></a><a href="#sobre" className="text-link">Sobre mim <ArrowRight size={17} /></a></div><div className="hero-socials"><a href={profile.github} {...external} aria-label="GitHub de Kaio Amim"><Github size={19} /></a><a href={profile.linkedin} {...external} aria-label="LinkedIn de Kaio Amim"><Linkedin size={19} /></a><a href={`mailto:${profile.email}`} aria-label="Enviar e-mail a Kaio Amim"><Mail size={19} /></a><span className="social-divider" /><span>React / PHP / Node.js</span></div></div>
        <div className="hero-art"><HeroScene paused={isPaused} onReady={()=>markLoaded('scene')}/><button className="motion-button icon-button" onClick={()=>setMotionEnabled(isPaused)} aria-label={isPaused?'Ativar animações automáticas':'Pausar animações automáticas'} aria-pressed={isPaused}>{isPaused?<Play size={15}/>:<Pause size={15}/>}</button></div>
        <div className="hero-bottom"><span><MapPin size={14} /> Barretos, São Paulo · Brasil</span><a href="#projetos">Explorar projetos <ArrowDown size={15} /></a><span className="hero-bottom-note">Desenvolvedor júnior</span></div>
      </section>

      <section className="projects-section container section" id="projetos" aria-labelledby="projects-title"><div className="section-heading"><div><p className="section-kicker"><span /> Projetos selecionados</p><h2 id="projects-title">Projetos<br />publicados<span className="accent">.</span></h2></div><div className="section-heading-aside"><p>Estoque, finanças, e-commerce e APIs.<br />Explore as aplicações no navegador.</p></div></div><div className="filter-group" role="group" aria-label="Filtrar projetos">{['Todos', 'Full stack', 'Front-end'].map(filter => <button key={filter} aria-pressed={projectFilter === filter} onClick={() => setProjectFilter(filter)}>{filter}{filter === 'Todos' && <span>04</span>}</button>)}</div><Carousel items={visibleProjects} reduced={isPaused} renderItem={project => <ProjectCard project={project} onDetails={setSelectedProject} reduced={isPaused}/>}/></section>
      <section className="about-section section" id="sobre" aria-labelledby="about-title"><div className="container about-grid"><div className="about-art portrait-art"><img className="about-portrait" src="/kaio-portrait.png" alt="Kaio Amim, de camisa preta e braços cruzados" width="1024" height="1536" loading="lazy" /><span className="monogram-caption">Barretos, São Paulo</span></div><div className="about-copy"><p className="section-kicker"><span /> Sobre mim</p><h2 id="about-title">Muito prazer,<br />Kaio Amim.</h2><p>Sou desenvolvedor de software em formação, com foco em <strong>backend e aplicações web</strong>. Minha experiência em suporte e infraestrutura de TI me ensinou a olhar para a tecnologia a partir de problemas reais.</p><p>Hoje, curso Sistemas de Informação e desenvolvo aplicações com PHP, JavaScript, Node.js, React e MySQL. Gosto de conectar interfaces, APIs e dados para construir soluções que fazem sentido.</p><p className="about-goal">Busco uma oportunidade como desenvolvedor júnior para contribuir, aprender e evoluir com um time.</p><a className="button button-outline cv-button" href={profile.resumeUrl} download="Curriculo-Kaio-Amim.pdf">Baixar meu currículo <Download size={17} /></a><span className="cv-note">PDF · Conheça meu percurso completo</span></div></div>
      <div className="timeline-section container section" id="trajetoria" aria-labelledby="timeline-title"><div className="section-heading"><div><p className="section-kicker"><span /> Minha trajetória</p><h2 id="timeline-title">Formação &<br />experiência<span className="accent">.</span></h2></div><p className="section-description">Da Etec ao bacharelado em Sistemas de Informação.<br />Minha experiência em desenvolvimento e suporte de TI.</p></div><div className="timeline-layout"><div className="timeline-sidebar"><div className="timeline-filters" role="group" aria-label="Filtrar trajetória">{[['all', 'Tudo', ArrowRight], ['work', 'Experiência', BriefcaseBusiness], ['education', 'Formação', GraduationCap], ['course', 'Cursos', Award]].map(([id, label, Icon]) => <button key={id} aria-pressed={timelineFilter === id} onClick={() => {setTimelineFilter(id);setTimelineExpanded(false)}}><Icon size={17} />{label}</button>)}</div></div><TransitionPanel changeKey={`${timelineFilter}-${timelineExpanded}`}><div className="timeline-list" aria-live="polite">{visibleTimeline.map((item, index) => { const Icon = { work: BriefcaseBusiness, education: GraduationCap, course: Award }[item.type]; return <article key={item.title} className="timeline-item" style={{'--item-delay': `${index * 65}ms`}}><div className={`timeline-icon ${item.current ? 'current' : ''}`}><Icon size={17} /></div><div className="timeline-date">{item.period}{item.current && <span>{item.type === 'work' ? 'Atualmente' : 'Em andamento'}</span>}</div><h3>{item.title}</h3><span className="timeline-org">{item.organization}</span><p>{item.description}</p></article>; })}</div></TransitionPanel></div>{filteredTimeline.length > 4 && <button className="timeline-more button button-outline" onClick={() => setTimelineExpanded(value => !value)}>{timelineExpanded ? 'Mostrar menos' : `Mostrar mais (${filteredTimeline.length - 4})`}<ArrowDown size={16} className={timelineExpanded ? 'is-open' : ''}/></button>}</div></section>
      <Skills reduced={isPaused}/><Process/><Contact/>
    </main><footer className="container site-footer"><Brand /><span>© {new Date().getFullYear()} Kaio Amim. Backend & Web.</span><a href="#inicio" className="back-top">Voltar ao topo <ArrowUp size={16} /></a></footer><ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} /></div>
  </>;
}
