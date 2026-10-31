import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause } from 'lucide-react';
export default function Carousel({items,renderItem,reduced}){
  const track=useRef(null);
  const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[interacting,setInteracting]=useState(false),[visible,setVisible]=useState(false);
  const indexRef=useRef(0);const scrollAnimation=useRef(null);
  useEffect(()=>()=>cancelAnimationFrame(scrollAnimation.current),[]);
  const go=(next)=>{
    const node=track.current,count=node.children.length;if(!count)return;
    const target=(next+count)%count,direction=next>indexRef.current?1:-1;
    cancelAnimationFrame(scrollAnimation.current);
    const from=node.scrollLeft,to=node.children[target].offsetLeft-node.children[0].offsetLeft,start=performance.now(),duration=reduced?420:680;
    node.style.scrollSnapType='none';
    [...node.querySelectorAll('.project-card')].forEach(card=>card.animate([{transform:'perspective(1000px) rotateY(0) scale(1)'},{transform:`perspective(1000px) rotateY(${-direction*8}deg) scale(.965)`,offset:.35},{transform:'perspective(1000px) rotateY(0) scale(1)'}],{duration,easing:'ease-in-out'}));
    const tick=now=>{const t=Math.min((now-start)/duration,1);const ease=1-Math.pow(1-t,3);node.scrollLeft=from+(to-from)*ease;if(t<1)scrollAnimation.current=requestAnimationFrame(tick);else{node.style.scrollSnapType='';indexRef.current=target;setIndex(target);}};
    scrollAnimation.current=requestAnimationFrame(tick);
  };
  useEffect(()=>{const node=track.current;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));observer.observe(node);const onScroll=()=>{const children=[...node.children];const first=children[0]?.offsetLeft||0;let best=0,dist=Infinity;children.forEach((item,i)=>{const d=Math.abs(item.offsetLeft-first-node.scrollLeft);if(d<dist){dist=d;best=i;}});indexRef.current=best;setIndex(best);};node.addEventListener('scroll',onScroll,{passive:true});return()=>{observer.disconnect();node.removeEventListener('scroll',onScroll);};},[]);
  useEffect(()=>{cancelAnimationFrame(scrollAnimation.current);track.current.style.scrollSnapType='';track.current.scrollTo({left:0,behavior:'instant'});indexRef.current=0;setIndex(0);},[items]);
  useEffect(()=>{if(reduced||paused||interacting||!visible||items.length<2)return;const interval=setInterval(()=>{if(!document.hidden)go(indexRef.current+1);},6000);return()=>clearInterval(interval);},[reduced,paused,interacting,visible,items.length]);
  return <div className="carousel" role="region" aria-roledescription="carrossel" aria-label="Projetos selecionados" onMouseEnter={()=>setInteracting(true)} onMouseLeave={()=>setInteracting(false)} onFocusCapture={()=>setInteracting(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setInteracting(false);}}>
    <div className="carousel-track" ref={track} tabIndex={0} onPointerDown={()=>{cancelAnimationFrame(scrollAnimation.current);track.current.style.scrollSnapType='';}} aria-label="Deslize para explorar os projetos" onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'){e.preventDefault();go(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(index-1);}}}>{items.map((item,i)=><div className="carousel-slide" key={item.id} role="group" aria-roledescription="slide" aria-label={`${i+1} de ${items.length}: ${item.title}`}>{renderItem(item)}</div>)}</div>
    <div className="carousel-controls"><span className="carousel-count" aria-live={paused||interacting||reduced?'polite':'off'}><b>{String(index+1).padStart(2,'0')}</b> / {String(items.length).padStart(2,'0')}</span><div className="carousel-dots">{items.map((item,i)=><button key={item.id} aria-label={`Mostrar ${item.title}`} aria-current={index===i?'true':undefined} onClick={()=>go(i)}/>)}</div><div className="carousel-arrows"><button className="icon-button" disabled={reduced} onClick={()=>setPaused(!paused)} aria-label={paused?'Reproduzir carrossel':'Pausar carrossel'} aria-pressed={paused||reduced}>{paused||reduced?<Play size={15}/>:<Pause size={15}/>}</button><button className="icon-button" aria-label="Projeto anterior" onClick={()=>go(index-1)}><ArrowLeft size={19}/></button><button className="icon-button" aria-label="Próximo projeto" onClick={()=>go(index+1)}><ArrowRight size={19}/></button></div></div>
  </div>;
}
