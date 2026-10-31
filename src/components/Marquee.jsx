import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import TechIcon from './TechIcon';
const techs=['React','JavaScript','PHP','Node.js','MySQL','HTML','CSS','Git & GitHub','Docker','Linux'];
export default function Marquee({reduced}){
 const [choice,setChoice]=useState(null);const paused=choice===null?reduced:!choice;
 return <div className="stack-marquee" role="region" aria-label="Letreiro de tecnologias"><div className={`technology-marquee ${paused?'is-paused':''}`} data-user-motion={choice===true?'on':undefined}><div className="technology-window"><div className="technology-track">{[0,1].map(copy=><div className="technology-group" key={copy} aria-hidden={copy===1}>{techs.map(tech=><span className="technology-logo" key={tech} title={tech} role="img" aria-label={tech}><TechIcon name={tech} size={40}/><i aria-hidden="true">✦</i></span>)}</div>)}</div></div></div><div className="stack-marquee-controls"><button className="icon-button" onClick={()=>setChoice(paused)} aria-label={paused?'Reproduzir ícones das stacks':'Pausar ícones das stacks'} aria-pressed={!paused}>{paused?<Play size={13}/>:<Pause size={13}/>}</button></div></div>;
}
