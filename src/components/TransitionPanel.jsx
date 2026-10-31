import { useEffect, useRef, useState } from 'react';
// Keep the previous panel visible through its exit before swapping content.
export default function TransitionPanel({changeKey,children}){
 const host=useRef(null),latest=useRef(children),current=useRef(changeKey);
 const [content,setContent]=useState(children);
 latest.current=children;
 useEffect(()=>{
  if(current.current===changeKey)return;
  current.current=changeKey;let cancelled=false,animation;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const run=async()=>{
   try{
    animation=host.current.animate([{opacity:1,transform:'rotateY(0) translateZ(0)'},{opacity:0,transform:`rotateY(${reduced?0:22}deg) translateZ(-90px)`}],{duration:reduced?100:350,fill:'forwards',easing:'ease-in'});
    await animation.finished;if(cancelled)return;
    setContent(latest.current);animation.cancel();
    animation=host.current.animate([{opacity:0,transform:`rotateY(${reduced?0:-22}deg) translateZ(-90px)`},{opacity:1,transform:'rotateY(0) translateZ(0)'}],{duration:reduced?100:450,easing:'ease-out'});
   }catch{/* interrupted by a newer selection */}
  };run();return()=>{cancelled=true;animation?.cancel();};
 },[changeKey]);
 return <div className="journey-transition"><div ref={host} aria-live="polite">{content}</div></div>;
}
