import { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
export function CursorGlow({reduced}){
  const ref=useRef(null);
  useEffect(()=>{if(reduced||!matchMedia('(pointer:fine)').matches)return;let frame;const move=e=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(!ref.current)return;ref.current.style.setProperty('--pointer-x',`${e.clientX}px`);ref.current.style.setProperty('--pointer-y',`${e.clientY}px`);ref.current.style.opacity='1';});};const leave=()=>{if(ref.current)ref.current.style.opacity='0';};window.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',leave);return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave);};},[reduced]);
  return <div className="cursor-glow" ref={ref} aria-hidden="true"/>;
}
export function ThemeToggle({reduced,shell}){
  const [theme,setTheme]=useState(()=>document.documentElement.dataset.theme||'dark');
  const [busy,setBusy]=useState(false);
  const animation=useRef(null);
  useEffect(()=>()=>animation.current?.cancel(),[]);
  const toggle=async()=>{
    if(busy)return;const next=theme==='dark'?'light':'dark';
    const apply=()=>{document.documentElement.dataset.theme=next;setTheme(next);document.querySelector('meta[name="theme-color"]')?.setAttribute('content',next==='dark'?'#111016':'#f7f6fb');try{localStorage.setItem('kaio-theme',next);}catch{/* Private storage can be unavailable. */}};
    if(!shell.current?.animate){apply();return;}
    setBusy(true);
    // Animate only the small toggle; the page itself never rotates or scales.
    apply();
    try{
      const button=document.querySelector('.theme-toggle');
      animation.current=button.animate([{opacity:.45,transform:'rotate(-20deg)'},{opacity:1,transform:'rotate(0deg)'}],{duration:reduced?0:220,easing:'ease-out'});
      await animation.current.finished;
    }catch{/* Cancelled by unmount. */}finally{animation.current?.cancel();setBusy(false);}

  };
  return <button className="theme-toggle icon-button" onClick={toggle} disabled={busy} aria-label={theme==='dark'?'Ativar tema claro':'Ativar tema escuro'} title={theme==='dark'?'Tema claro':'Tema escuro'}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button>;
}
// Adapted from the attached portfolio's vertical-word loader.
export function BootScreen({onEnter}){
 return <div className="intro-loader"><div role="status" aria-label="Carregando portfólio" className="intro-word-loader"><span aria-hidden="true">Carregando</span><div className="intro-words" aria-hidden="true"><div><span>ideias</span><span>interfaces</span><span>projetos</span><span>conexões</span><span>ideias</span></div></div></div><button onClick={onEnter}>Entrar no portfólio <span aria-hidden="true">↗</span></button></div>;
}
