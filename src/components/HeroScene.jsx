import { useEffect, useRef, useState } from 'react'

const views = [0, Math.PI / 4, Math.PI / 2, Math.PI]
export default function HeroScene({paused=false,onReady}) {
  const pausedRef=useRef(paused);
  useEffect(()=>{pausedRef.current=paused},[paused]);
  const readyRef=useRef(onReady);
  const canvasRef = useRef(null)
  const target = useRef({ yaw: 0, pitch: -.08 })
  const drag = useRef(null)
  const [view, setView] = useState(0)
  function selectView(index) { target.current = { yaw: views[index], pitch: -.08 }; setView(index) }
  function down(e) { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, moved: false } }
  function move(e) {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true
    target.current.yaw += dx * .009
    target.current.pitch = Math.max(-.6, Math.min(.6, target.current.pitch + dy * .006))
    drag.current.x = e.clientX; drag.current.y = e.clientY
    setView(-1)
  }
  function up(e) {
    drag.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }
  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas.getContext('2d')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0, height = 0, frame, last = 0, time = 0, rendered = false, yaw = 0, pitch = -.08, visible = true
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    observer.observe(canvas)
    const resize = new ResizeObserver(([entry]) => {
      rendered=false; width = entry.contentRect.width; height = entry.contentRect.height
      const dpr = Math.min(devicePixelRatio, 2)
      canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    })
    resize.observe(canvas)
    // Each contour consists of real XYZ vertices, projected only after rotation.
    const meshes = []
    const add = (center, scale, box = 1, brain = false, taper = 0) => {
      const rows = [], columns = 18, levels = brain ? 16 : 10
      const power = v => Math.sign(v) * Math.pow(Math.abs(v), box)
      for (let j = 0; j <= levels; j++) {
        const lat = j / levels * Math.PI, row = []
        for (let k = 0; k <= columns; k++) {
          const lon = k / columns * Math.PI * 2
          const fold = brain ? 1 + .085 * Math.sin(lon * 9 + lat * 11) * Math.sin(lat * 7) : 1
          const narrowing = 1 - taper * Math.cos(lat)
          row.push([center[0] + power(Math.sin(lat) * Math.cos(lon)) * scale[0] * fold * narrowing, center[1] + power(Math.cos(lat)) * scale[1] * fold, center[2] + power(Math.sin(lat) * Math.sin(lon)) * scale[2] * fold * narrowing])
        }
        rows.push(row)
      }
      meshes.push({ rows, brain })
    }
    add([0, -.28, 0], [.74, .5, .47], .65) // broad rounded head
    add([0, .65, 0], [.44, .61, .32], 1, false, .48)
    add([-.62, .6, 0], [.15, .36, .16], 1, false, .35); add([.62, .6, 0], [.15, .36, .16], 1, false, .35)
    add([-.75, -.26, 0], [.1, .2, .19]); add([.75, -.26, 0], [.1, .2, .19])
    add([0, .22, 0], [.17, .18, .18])
    function draw(now = 0) {
      frame = requestAnimationFrame(draw)
      if (now - last < 1000 / 30) return
      const dt = Math.min((now - last) / 1000, .06); last = now
      if (!visible || document.hidden || !width || !height) return
      if(pausedRef.current && rendered && Math.abs(target.current.yaw-yaw)<.001 && Math.abs(target.current.pitch-pitch)<.001)return
      rendered=true
      if (!pausedRef.current) time += dt
      const ease = reduced.matches ? 1 : .09
      yaw += (target.current.yaw - yaw) * ease; pitch += (target.current.pitch - pitch) * ease
      const angle = yaw
      const size = Math.min(width / 4.1, height / 3.9)
      const project = ([a,b,c]) => {
        const xx = a * Math.cos(angle) + c * Math.sin(angle), zz = c * Math.cos(angle) - a * Math.sin(angle)
        const yy = b * Math.cos(pitch) - zz * Math.sin(pitch), z = b * Math.sin(pitch) + zz * Math.cos(pitch)
        const perspective = 5 / (5 - z)
        return [width / 2 + xx * size * perspective, height * .48 + (yy + Math.sin(time * 1.4) * .035) * size * perspective, z]
      }
      ctx.clearRect(0, 0, width, height)
      const halo = ctx.createRadialGradient(width / 2, height * .4, 0, width / 2, height * .4, size * 1.9)
      halo.addColorStop(0, '#a05aff28'); halo.addColorStop(1, '#a05aff00'); ctx.fillStyle = halo; ctx.fillRect(0, 0, width, height)
      function path(points, color, weight = .7, fill) {
        ctx.beginPath(); points.forEach((p,i) => i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1]))
        if (fill) { ctx.closePath(); ctx.fillStyle = fill; ctx.fill() }
        ctx.strokeStyle = color; ctx.lineWidth = weight; ctx.stroke()
      }
      // Extruded polygonal K: front, rear and side faces, with dimensional lighting.
      const outline = [[-.23,-1.62],[-.08,-1.62],[-.08,-1.42],[.09,-1.62],[.28,-1.62],[.03,-1.34],[.29,-1.04],[.09,-1.04],[-.08,-1.25],[-.08,-1.04],[-.23,-1.04]]
      const front = outline.map(([a,b])=>project([a,b,.27]))
      const rear = outline.map(([a,b])=>project([a,b,-.2]))
      const faces = [{ points: rear, fill: '#3e1e6bdd', stroke: '#a36ae5' }]
      for (let i=0;i<outline.length;i++) {
        const j=(i+1)%outline.length
        const points=[rear[i],rear[j],front[j],front[i]]
        faces.push({points, fill:i%3===0?'#a978eac9':'#6435a5d9',stroke:'#bc8afc'})
      }
      faces.push({points:front,fill:'#9455f54d',stroke:'#f0d9ff'})
      faces.sort((a,b)=>a.points.reduce((s,p)=>s+p[2],0)/a.points.length-b.points.reduce((s,p)=>s+p[2],0)/b.points.length)
      ctx.shadowColor='#a662ff'; ctx.shadowBlur=9
      faces.forEach(face=>path(face.points,face.stroke,.8,face.fill))
      // Scanlines clipped to the broad front face keep the solid K holographic.
      ctx.save()
      ctx.beginPath(); front.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])); ctx.closePath(); ctx.clip()
      for (let j=0;j<18;j++) {
        const h=-1.62+j*.034
        path([project([-.25,h,.272]),project([.3,h,.272])],'#dcbaff85',.6)
      }
      ctx.restore()
      ctx.shadowBlur=0
      const base = Array.from({length:41},(_,i)=>project([Math.cos(i/40*Math.PI*2)*.3,-.98,Math.sin(i/40*Math.PI*2)*.19]))
      path(base,'#b67aff65',.7)
      path([project([-.13,-.87,0]),project([-.22,-1.02,0])],'#ad68ff30')
      path([project([.13,-.87,0]),project([.22,-1.02,0])],'#ad68ff30')
      const polys = []
      for (const mesh of meshes) {
        const rows = mesh.rows.map(row => row.map(project))
        rows.forEach((row,j) => {
          if (j === rows.length - 1) return
          for (let k = 0; k < row.length - 1; k++) {
            const vertices = [row[k], row[k+1], rows[j+1][k+1], rows[j+1][k]]
            for (const triangle of [[vertices[0],vertices[1],vertices[2]], [vertices[0],vertices[2],vertices[3]]]) {
              polys.push({ vertices: triangle, depth: triangle.reduce((sum,p)=>sum+p[2],0)/3, brain: mesh.brain })
            }
          }
        })
      }
      polys.sort((a,b)=>a.depth-b.depth)
      for (const poly of polys) {
        const a = .13 + Math.max(0, poly.depth) * .55
        path(poly.vertices, `rgba(${poly.brain ? '222,175,255' : '180,133,255'},${a})`, poly.brain ? .65 : .5, `rgba(132,67,226,${poly.brain ? .035 : .035 + Math.max(0,poly.depth)*.1})`)
      }
      // Face surface and illuminated expressions live on the front of the head.
      if (Math.cos(angle) > -.15) {
        const face = []
        for (let i = 0; i <= 60; i++) { const a = i/60*Math.PI*2; face.push(project([Math.sign(Math.cos(a))*Math.pow(Math.abs(Math.cos(a)),.65)*.61,-.28+Math.sign(Math.sin(a))*Math.pow(Math.abs(Math.sin(a)),.65)*.34,.48])) }
        path(face, '#d1a5ffb0', 1.3, '#100c22ee')
        ctx.shadowColor = '#be78ff'; ctx.shadowBlur = 18
        // The parent owns motion preferences and the explicit play/pause override.
        const blinkPhase = time % 3.8
        const blink = blinkPhase > .8 && blinkPhase < 1.4
          ? Math.max(.025, 1 - 1.2 * Math.sin((blinkPhase - .8) / .6 * Math.PI) ** 2)
          : 1
        for (const side of [-1, 1]) {
          const eye = Array.from({length:41},(_,i)=>{ const t=i/40*Math.PI*2; return project([side*.26+Math.cos(t)*.115,-.26+Math.sin(t)*.13*blink,.5]) })
          path(eye, '#b67bff', 5)
          path(eye, '#f2ddff', 1.7)
        }
        ctx.shadowBlur = 0
      }
      const core = Array.from({length:33},(_,i)=>project([Math.cos(i/32*Math.PI*2)*.09,.6+Math.sin(i/32*Math.PI*2)*.09,.35]))
      path(core, '#d4a1ff', 1.5)
      for (let k = 0; k < 3; k++) {
        const ring = Array.from({length:65},(_,i)=>project([Math.cos(i/64*Math.PI*2)*(1+k*.15),1.55,Math.sin(i/64*Math.PI*2)*(1+k*.15)]))
        ctx.shadowColor = '#a95cff'; ctx.shadowBlur = k === 0 ? 14 : 0
        path(ring, k === 0 ? '#d1a5ff' : '#a064ff65', k === 0 ? 2 : 1)
        ctx.shadowBlur = 0
      }
      const scanY = -.95 + (time * .3 % 2.3)
      path([project([-.8,scanY,0]),project([.8,scanY,0])], '#dfb9ff80', 1)
      for (let i = 0; i < 34; i++) {
        const p=project([Math.sin(i*7.31)*1.35,((i*.371+time*.07)%3.3)-1.7,Math.cos(i*4.1)*.8])
        ctx.fillStyle='#c49aff88'; ctx.beginPath(); ctx.arc(p[0],p[1],i%4? .8:1.6,0,Math.PI*2); ctx.fill()
      }
    }
    draw(); readyRef.current?.()
    return () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect() }
  }, [])
  return <div className={`volume-scene ${paused?'hologram-paused':''}`}>
    <div className="holo-dashboards" aria-hidden="true">
      <div className="holo-panel holo-code"><div className="holo-panel-title"><i /> SYSTEM / CODE <span>01</span></div><div className="holo-code-lines">{Array.from({length:15},(_,i)=><div key={i} style={{paddingLeft:`${i%4*5}px`}}><b>{String(i+1).padStart(2,'0')}</b><span style={{width:`${25+(i*23)%55}%`}}/><em style={{width:`${10+i%3*6}%`}}/></div>)}</div><div className="holo-panel-footer"><i /> BUILD COMPLETE</div></div>
      <div className="holo-panel holo-analytics"><div className="holo-panel-title"><i /> ANALYTICS <span>02</span></div><div className="holo-metrics"><div className="holo-donut"/><div><span>NEURAL ACTIVITY</span><strong>98.4<small>%</small></strong><i>↑ SYSTEM ONLINE</i></div></div><div className="holo-bars">{[35,60,45,80,65,92,75,100].map((h,i)=><i key={i} style={{height:`${h}%`,animationDelay:`${-i*.4}s`}}/>)}</div></div>
      <div className="holo-panel holo-signal"><div className="holo-panel-title"><i /> LIVE / SIGNAL <span>03</span></div><svg viewBox="0 0 160 55"><defs><linearGradient id="signal-fill" x2="0" y2="1"><stop stopColor="#b47aff" stopOpacity=".35"/><stop offset="1" stopColor="#b47aff" stopOpacity="0"/></linearGradient></defs><path d="M0 43L15 40 25 45 40 25 55 29 70 12 85 23 100 16 115 20 130 7 145 13 160 4V55H0Z" fill="url(#signal-fill)"/><path d="M0 43L15 40 25 45 40 25 55 29 70 12 85 23 100 16 115 20 130 7 145 13 160 4" fill="none" stroke="#d3a9ff" strokeWidth="1.5"/></svg><div className="holo-panel-footer">● CONNECTED <span>24 ms</span></div></div>
      <svg className="holo-connections" viewBox="0 0 500 500"><path d="M120 200H155L190 245M380 165H348L310 235M380 330H348L305 295"/><circle cx="190" cy="245" r="3"/><circle cx="310" cy="235" r="3"/><circle cx="305" cy="295" r="3"/></svg>
    </div>
    <canvas ref={canvasRef} className="robot-volume" role="button" tabIndex={0} aria-label="Explorar robô holográfico em 3D. Segure e arraste para girar ou use as setas do teclado." onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { drag.current = null }} onKeyDown={e => { if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key)) { e.preventDefault(); if (e.key === 'Enter' || e.key === ' ') selectView((view+1)%4); else { target.current.yaw += e.key === 'ArrowLeft' ? -.25 : e.key === 'ArrowRight' ? .25 : 0; target.current.pitch = Math.max(-.6,Math.min(.6,target.current.pitch + (e.key === 'ArrowUp' ? -.1 : e.key === 'ArrowDown' ? .1 : 0))); setView(-1) } } }} />
    <div className="robot-views" role="group" aria-label="Ângulo do holograma">{['Frente','¾','Lateral','Costas'].map((label,i)=><button key={label} onClick={()=>selectView(i)} aria-pressed={view===i}>{label}</button>)}</div>
  </div>
}
