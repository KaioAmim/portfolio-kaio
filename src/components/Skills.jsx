import {useState} from 'react';
import {Code2, Database, Terminal, Layers} from 'lucide-react';
import {skillLevels} from '../content';
import TechIcon from './TechIcon';
import Marquee from './Marquee';
export default function Skills({reduced}){
 const [category,setCategory]=useState('Todas');
 const groups=[['Todas',Layers,skillLevels.map(s=>s.name)],['Desenvolvimento',Code2,['JavaScript','HTML','CSS','React']],['Backend & dados',Database,['PHP','Node.js','MySQL']],['Ferramentas & ambiente',Terminal,['Git','Docker','Linux']]];
 const visible=skillLevels.filter(s=>groups.find(g=>g[0]===category)[2].includes(s.name));
 return <section id="stacks" className="skills-details section" aria-labelledby="skills-title"><div className="container"><div className="section-heading"><div><p className="section-kicker"><span/>Ferramentas & tecnologias</p><h2 id="skills-title">Stacks<span className="accent">.</span></h2></div><p className="section-description">Conhecimento em prática.<br/>Níveis estimados pelo uso em projetos e na experiência profissional.</p></div><div className="stack-filters" role="group" aria-label="Filtrar stacks">{groups.map(([label,Icon,names])=><button key={label} aria-pressed={category===label} aria-controls="stack-results" onClick={()=>setCategory(label)}><Icon size={18}/><span>{label}</span><small>{String(names.length).padStart(2,'0')}</small></button>)}</div><div id="stack-results" className="skill-grid" aria-live="polite">{visible.map(skill=><div className="skill-row" key={skill.name}><div className="skill-title"><span><TechIcon name={skill.name}/>{skill.name}</span><small>{skill.level}</small></div><div className="skill-meter" aria-label={`${skill.name}: ${skill.level}`}>{[1,2,3].map(n=><i key={n} className={n<=skill.stage?'filled':''}/>)}</div><p>{skill.detail}</p></div>)}</div><div className="skill-legend"><span>01 / Básico</span><span>02 / Intermediário</span><span>03 / Avançado</span></div></div><Marquee reduced={reduced} compact/></section>;
}
