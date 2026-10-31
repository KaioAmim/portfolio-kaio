import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// A real-time workspace: modeled laptop, animated editor and a connected data cloud.
export default function Sculpture({ paused, onReady, mode, turn, reset }) {
  const host = useRef(null);
  const pausedRef = useRef(paused);
  const readyRef = useRef(onReady);
  const controls = useRef({mode,turn,reset});
  useEffect(() => { controls.current={mode,turn,reset}; }, [mode,turn,reset]);
  const [failed, setFailed] = useState(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => {
    const container = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { setFailed(true); readyRef.current?.(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37, 1, .1, 50);
    camera.position.set(4.3, 3.1, 7.8);
    camera.lookAt(0, .15, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    room.dispose();
    scene.environment = environment.texture;
    const world = new THREE.Group();
    scene.add(world);
    const metal = new THREE.MeshStandardMaterial({ color: '#34313e', metalness: .87, roughness: .28 });
    const edge = new THREE.MeshStandardMaterial({ color: '#b7a7c1', metalness: .9, roughness: .25 });
    const dark = new THREE.MeshStandardMaterial({ color: '#11121c', metalness: .5, roughness: .35 });
    const keyMaterial = new THREE.MeshStandardMaterial({ color: '#281c32', emissive: '#7144c0', emissiveIntensity: .22, roughness: .4 });
    const glowMaterial = new THREE.MeshBasicMaterial({ color: '#a289ff' });
    const box = (w,h,d,material,x,y,z,parent=world) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
      mesh.position.set(x,y,z); parent.add(mesh); return mesh;
    };
    box(3.7,.12,2.35,edge,0,-1.08,.22);
    box(3.65,.06,2.30,metal,0,-1,.22);
    box(1.15,.012,.61,dark,0,-.962,.93);
    const keyboard = new THREE.InstancedMesh(new THREE.BoxGeometry(.215,.027,.17),keyMaterial,60);
    const matrix = new THREE.Matrix4();
    for(let row=0;row<5;row++) for(let col=0;col<12;col++) {
      matrix.makeTranslation((col-5.5)*.267,-.95,-.53+row*.225);
      keyboard.setMatrixAt(row*12+col,matrix);
    }
    world.add(keyboard);
    box(.1,.018,.018,glowMaterial,1.55,-1.03,1.402);
    const lid = new THREE.Group(); lid.position.set(0,-1,-.92);lid.rotation.x=-.17;world.add(lid);
    box(3.7,2.3,.105,metal,0,1.15,0,lid);
    box(3.45,2.08,.013,dark,0,1.16,.06,lid);
    const codeCanvas=document.createElement('canvas');codeCanvas.width=1024;codeCanvas.height=640;
    const ctx=codeCanvas.getContext('2d');
    const texture = new THREE.CanvasTexture(codeCanvas);texture.colorSpace=THREE.SRGBColorSpace;
    const screenMaterial = new THREE.MeshBasicMaterial({map:texture});
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.34,1.98),screenMaterial);
    screen.position.set(0,1.16,.075);lid.add(screen);
    const rows = [
      ['// kaio-amim / workspace', '#858193'],
      ['const developer = {', '#a68cff'],
      ['  name: "Kaio Amim",', '#a8dfb1'],
      ['  focus: "Backend & Web",', '#a8dfb1'],
      ['  stack: ["React", "PHP", "Node.js"]', '#e9cc83'],
      ['};', '#bca9da'],
      ['', '#fff'],
      ['async function conectarProjeto() {', '#a68cff'],
      ['  const dados = await api.get("/projetos");', '#8dcff0'],
      ['  return render(dados);', '#e9cc83'],
      ['}', '#bca9da'],
    ];
    let lastStep=-1;
    const drawScreen = step => {
      ctx.fillStyle='#10111a';ctx.fillRect(0,0,1024,640);
      ctx.fillStyle='#1e1d2a';ctx.fillRect(0,0,1024,58);
      ['#a68cff','#ecd278','#94d6b2'].forEach((color,i)=>{ctx.beginPath();ctx.fillStyle=color;ctx.arc(28+i*25,28,6,0,Math.PI*2);ctx.fill();});
      ctx.font='21px monospace';ctx.fillStyle='#b4acbf';ctx.fillText('kaio.dev / projetos.js',140,36);
      rows.forEach(([text,color],i)=>{
        if(i===step%11){ctx.fillStyle='#a68cff0b';ctx.fillRect(0,83+i*38,1024,38);}
        ctx.font='23px monospace';ctx.fillStyle='#4a485b';ctx.fillText(String(i+1).padStart(2,'0'),25,110+i*38);
        ctx.fillStyle=color;ctx.fillText(text,85,110+i*38);
      });
      ctx.fillStyle='#24202e';ctx.fillRect(0,545,1024,95);
      ctx.fillStyle='#a68cff';ctx.font='22px monospace';ctx.fillText('> ambiente de desenvolvimento',28,582);
      ctx.fillStyle='#a3dcbf';ctx.fillText('  pronto para conectar' + (step%2 ? ' _' : ''),28,616);
      texture.needsUpdate=true;
    };
    drawScreen(0);
    // Two folded hemispheres, a central fissure and a brainstem.
    const cloud = new THREE.Group();cloud.position.set(.85,1.7,-.45);world.add(cloud);
    const brainMaterial=new THREE.MeshPhysicalMaterial({color:'#8265ed',emissive:'#49309b',emissiveIntensity:.45,metalness:.35,roughness:.36,transparent:true,opacity:.88,clearcoat:.8});
    const creaseMaterial=new THREE.MeshBasicMaterial({color:'#c4b8ff',transparent:true,opacity:.72});
    for(const side of [-1,1]){
      const geometry=new THREE.SphereGeometry(1,52,36);const pos=geometry.attributes.position;
      for(let i=0;i<pos.count;i++){
        const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
        const fold=1+.055*Math.sin(y*18+z*9)*Math.cos(x*16-z*7)+.025*Math.cos(z*30+y*12);
        pos.setXYZ(i,x*.55*fold+side*.30,y*.50*fold,z*.77*fold);
      }
      geometry.computeVertexNormals();cloud.add(new THREE.Mesh(geometry,brainMaterial));
      for(let fold=0;fold<8;fold++){
        const curvePoints=[];
        for(let k=0;k<=55;k++){
          const t=k/55*Math.PI,theta=fold/8*Math.PI*2+.11*Math.sin(t*8+fold);
          const x=Math.cos(theta)*Math.sin(t)*.56+side*.30;
          const y=Math.cos(t)*.51;
          const z=Math.sin(theta)*Math.sin(t)*.79;
          curvePoints.push(new THREE.Vector3(x,y,z));
        }
        const curve=new THREE.CatmullRomCurve3(curvePoints);
        cloud.add(new THREE.Mesh(new THREE.TubeGeometry(curve,55,.009,4,false),creaseMaterial));
      }
    }
    const stem=new THREE.Mesh(new THREE.CylinderGeometry(.14,.07,.5,12),brainMaterial);stem.position.set(0,-.59,-.12);stem.rotation.x=-.35;cloud.add(stem);
    const cerebellum=new THREE.Mesh(new THREE.SphereGeometry(.29,20,16),brainMaterial);cerebellum.scale.set(1.25,.7,1);cerebellum.position.set(0,-.42,-.48);cloud.add(cerebellum);
    const positions=[];
    for(let i=0;i<90;i++){const y=1-2*i/89,r=Math.sqrt(1-y*y),t=i*2.399963;positions.push(Math.cos(t)*r*.94,y*.74,Math.sin(t)*r*.85);}
    const cloudGeometry=new THREE.BufferGeometry();cloudGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    const cloudPoints=new THREE.Points(cloudGeometry,new THREE.PointsMaterial({color:'#c9bdff',size:.026,transparent:true,opacity:.8}));cloud.add(cloudPoints);
    const dataLines=[];
    for(let i=0;i<12;i++){const x=.65+(i%4)*.36,z=-.6+Math.floor(i/4)*.3;dataLines.push(x,.9,z,x,-.3-(i%3)*.12,z);}
    const dropsGeometry=new THREE.BufferGeometry();dropsGeometry.setAttribute('position',new THREE.Float32BufferAttribute(dataLines,3));
    world.add(new THREE.LineSegments(dropsGeometry,new THREE.LineBasicMaterial({color:'#7059bb',transparent:true,opacity:.35})));
    const orbitGeometry=new THREE.BufferGeometry();const orbitPoints=[];
    for(let i=0;i<65;i++){const t=i/64*Math.PI*2;orbitPoints.push(Math.cos(t)*2.7,-1.25,Math.sin(t)*1.7);}
    orbitGeometry.setAttribute('position',new THREE.Float32BufferAttribute(orbitPoints,3));
    world.add(new THREE.Line(new THREE.BufferGeometry().copy(orbitGeometry),new THREE.LineBasicMaterial({color:'#6d4dc1',transparent:true,opacity:.3})));orbitGeometry.dispose();
    const key = new THREE.DirectionalLight('#e4dfff',4);key.position.set(-3,5,4);
    const magenta = new THREE.PointLight('#8456ee',60,12);magenta.position.set(3,1,3);
    const blue = new THREE.PointLight('#728ee7',30,12);blue.position.set(-3,2,1);
    scene.add(key,magenta,blue);
    const pointer={x:0,y:0};let frame,visible=true,last=0,elapsed=0,lost=false,dragging=false,dragX=0,angle=0,dirty=0,lastReset=0,lastMode='neural';
    const resize=()=>{const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.render(scene,camera);};
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);
    const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});intersection.observe(container);
    const move=e=>{const r=container.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width*2-1;pointer.y=(e.clientY-r.top)/r.height*2-1;if(dragging){angle+=(e.clientX-dragX)*.008;dragX=e.clientX;}dirty=40;};
    const down=e=>{dragging=true;dragX=e.clientX;container.setPointerCapture(e.pointerId);};
    const up=()=>{dragging=false;};
    container.addEventListener('pointerdown',down);container.addEventListener('pointerup',up);container.addEventListener('pointercancel',up);
    const leave=()=>{pointer.x=0;pointer.y=0;};
    container.addEventListener('pointermove',move);container.addEventListener('pointerleave',leave);
    const contextLost=e=>{e.preventDefault();lost=true;setFailed(true);};renderer.domElement.addEventListener('webglcontextlost',contextLost);
    const animate=time=>{
      frame=requestAnimationFrame(animate);const delta=Math.min((time-last)/1000,.05);last=time;
      if(!visible||document.hidden||lost)return;
      if(!pausedRef.current)elapsed+=delta;
      if(controls.current.reset!==lastReset){angle=0;pointer.x=0;pointer.y=0;lastReset=controls.current.reset;dirty=50;}
      const target=controls.current.turn*.55+angle+pointer.x*.25;
      const modeChanged=lastMode!==controls.current.mode;lastMode=controls.current.mode;
      if(pausedRef.current&&dirty<=0&&!modeChanged&&Math.abs(world.rotation.y-target)<.001)return;
      dirty=Math.max(0,dirty-1);
      world.rotation.y=THREE.MathUtils.lerp(world.rotation.y,target,.08);
      world.rotation.x=THREE.MathUtils.lerp(world.rotation.x,pointer.y*.05,.04);
      world.position.y=Math.sin(elapsed*.8)*.045;cloud.rotation.y=Math.sin(elapsed*.4)*.22;
      brainMaterial.wireframe=controls.current.mode==='data';
      brainMaterial.emissiveIntensity=controls.current.mode==='agents'?.85:.45;
      cloud.scale.setScalar(controls.current.mode==='agents'?1.12:1);
      cloudPoints.material.opacity=.8+Math.sin(elapsed*1.3)*.2;
      const step=Math.floor(elapsed*1.5);if(step!==lastStep){drawScreen(step);lastStep=step;}
      renderer.render(scene,camera);
    };
    resize();readyRef.current?.();frame=requestAnimationFrame(animate);
    return()=>{
      cancelAnimationFrame(frame);resizeObserver.disconnect();intersection.disconnect();
      container.removeEventListener('pointerdown',down);container.removeEventListener('pointerup',up);container.removeEventListener('pointercancel',up);
      container.removeEventListener('pointermove',move);container.removeEventListener('pointerleave',leave);
      renderer.domElement.removeEventListener('webglcontextlost',contextLost);
      const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());texture.dispose();environment.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();
    };
  }, []);
  return <div className="sculpture-canvas" ref={host} aria-hidden="true">{failed&&<div className="terminal-fallback"><span>kaio.dev</span><pre>{'const kaio = {\n  foco: "Backend & Web",\n  stack: ["React", "PHP", "Node.js"]\n};'}</pre><i /></div>}</div>;
}
