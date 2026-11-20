import { useEffect, useRef, useState } from 'react';

const views = [0, Math.PI / 4, Math.PI / 2, Math.PI];
export default function HeroScene({ paused = false, onReady, errorMode = false, errorCode = 404 }) {
  const pausedRef = useRef(paused);
  const wakeFrameRef = useRef(null);
  useEffect(() => {
    pausedRef.current = paused;
    wakeFrameRef.current?.();
  }, [paused]);
  const readyRef = useRef(onReady);
  const canvasRef = useRef(null);
  const target = useRef({ yaw: 0, pitch: -0.08 });
  const drag = useRef(null);
  const [view, setView] = useState(0);
  function selectView(index) {
    target.current = { yaw: views[index], pitch: -0.08 };
    setView(index);
    wakeFrameRef.current?.();
  }
  function down(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  }
  function move(e) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x,
      dy = e.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true;
    target.current.yaw += dx * 0.009;
    target.current.pitch = Math.max(-0.6, Math.min(0.6, target.current.pitch + dy * 0.006));
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
    setView(-1);
    wakeFrameRef.current?.();
  }
  function up(e) {
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  }
  useEffect(() => {
    const canvas = canvasRef.current,
      ctx = canvas.getContext('2d');
    let hologramLogo = null;
    if (!errorMode) {
      const logo = new Image();
      logo.onload = () => {
        // Match the SVG viewBox so the crop mask is independent of browser intrinsic sizing.
        const width = 980;
        const height = 740;
        const hologram = document.createElement('canvas');
        hologram.width = width;
        hologram.height = height;
        const hologramCtx = hologram.getContext('2d');
        hologramCtx.drawImage(logo, 0, 0, width, height);
        const mask = document.createElement('canvas');
        mask.width = width;
        mask.height = height;
        const maskCtx = mask.getContext('2d');
        maskCtx.strokeStyle = '#fff';
        maskCtx.fillStyle = '#fff';
        maskCtx.lineCap = 'round';
        maskCtx.lineJoin = 'round';
        // Keep only the K and A strokes; the source logo's triangle stays out.
        maskCtx.fillRect(270, 352, 38, 250);
        maskCtx.lineWidth = 42;
        maskCtx.beginPath();
        maskCtx.moveTo(326, 466);
        maskCtx.lineTo(462, 352);
        maskCtx.stroke();
        maskCtx.lineWidth = 48;
        maskCtx.beginPath();
        maskCtx.moveTo(340, 466);
        maskCtx.lineTo(481, 602);
        maskCtx.stroke();
        maskCtx.lineWidth = 42;
        maskCtx.beginPath();
        maskCtx.moveTo(475, 551);
        maskCtx.lineTo(600, 362);
        maskCtx.lineTo(728, 580);
        maskCtx.stroke();
        maskCtx.lineWidth = 25;
        maskCtx.beginPath();
        maskCtx.moveTo(521, 526);
        maskCtx.quadraticCurveTo(590, 500, 663, 526);
        maskCtx.stroke();
        hologramCtx.globalCompositeOperation = 'destination-in';
        hologramCtx.drawImage(mask, 0, 0);
        hologramCtx.globalCompositeOperation = 'source-in';
        const tint = hologramCtx.createLinearGradient(0, 350, 0, 610);
        tint.addColorStop(0, '#f7eaff');
        tint.addColorStop(0.52, '#c58eff');
        tint.addColorStop(1, '#8947ff');
        hologramCtx.fillStyle = tint;
        hologramCtx.fillRect(0, 0, width, height);
        hologramLogo = hologram;
        wakeFrameRef.current?.();
      };
      logo.src = '/brand/logo-ka-symbol.svg';
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const lowPowerDevice =
      matchMedia('(max-width: 600px)').matches ||
      (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory > 0 && navigator.deviceMemory <= 4);
    const frameDelay = lowPowerDevice ? 1000 / 20 : 1000 / 30;
    let width = 0,
      height = 0,
      frame = null,
      frameTimer = null,
      last = 0,
      time = 0,
      rendered = false,
      yaw = 0,
      pitch = -0.08,
      visible = true;
    const stopFrame = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      if (frameTimer !== null) clearTimeout(frameTimer);
      frame = null;
      frameTimer = null;
    };
    const scheduleFrame = () => {
      if (frame !== null || frameTimer !== null || !visible || document.hidden || !width || !height)
        return;
      if (
        pausedRef.current &&
        rendered &&
        Math.abs(target.current.yaw - yaw) < 0.001 &&
        Math.abs(target.current.pitch - pitch) < 0.001
      )
        return;
      frameTimer = window.setTimeout(() => {
        frameTimer = null;
        if (visible && !document.hidden) frame = requestAnimationFrame(draw);
      }, frameDelay);
    };
    const wakeFrame = () => {
      stopFrame();
      if (visible && !document.hidden && width && height) frame = requestAnimationFrame(draw);
    };
    wakeFrameRef.current = wakeFrame;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wakeFrame();
      else stopFrame();
    });
    observer.observe(canvas);
    const resize = new ResizeObserver(([entry]) => {
      rendered = false;
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(devicePixelRatio, lowPowerDevice ? 1.25 : 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wakeFrame();
    });
    resize.observe(canvas);
    const onVisibilityChange = () => {
      if (document.hidden) stopFrame();
      else wakeFrame();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    // Each contour consists of real XYZ vertices, projected only after rotation.
    const meshes = [];
    const add = (center, scale, box = 1, brain = false, taper = 0) => {
      const rows = [],
        columns = lowPowerDevice ? 16 : 24,
        levels = lowPowerDevice ? (brain ? 14 : 10) : brain ? 20 : 14;
      const power = (v) => Math.sign(v) * Math.pow(Math.abs(v), box);
      for (let j = 0; j <= levels; j++) {
        const lat = (j / levels) * Math.PI,
          row = [];
        for (let k = 0; k <= columns; k++) {
          const lon = (k / columns) * Math.PI * 2;
          const fold = brain ? 1 + 0.085 * Math.sin(lon * 9 + lat * 11) * Math.sin(lat * 7) : 1;
          const narrowing = 1 - taper * Math.cos(lat);
          row.push([
            center[0] + power(Math.sin(lat) * Math.cos(lon)) * scale[0] * fold * narrowing,
            center[1] + power(Math.cos(lat)) * scale[1] * fold,
            center[2] + power(Math.sin(lat) * Math.sin(lon)) * scale[2] * fold * narrowing,
          ]);
        }
        rows.push(row);
      }
      meshes.push({ rows, brain });
    };
    add([0, -0.28, 0], [0.74, 0.5, 0.47], 0.65); // broad rounded head
    add([0, 0.65, 0], [0.44, 0.61, 0.32], 1, false, 0.48);
    add([-0.62, 0.6, 0], [0.15, 0.36, 0.16], 1, false, 0.35);
    add([0.62, 0.6, 0], [0.15, 0.36, 0.16], 1, false, 0.35);
    add([-0.75, -0.26, 0], [0.1, 0.2, 0.19]);
    add([0.75, -0.26, 0], [0.1, 0.2, 0.19]);
    add([0, 0.22, 0], [0.17, 0.18, 0.18]);
    function draw(now = 0) {
      frame = null;
      const dt = Math.min((now - last) / 1000, 0.06);
      last = now;
      if (!visible || document.hidden || !width || !height) return;
      const settled =
        Math.abs(target.current.yaw - yaw) < 0.001 &&
        Math.abs(target.current.pitch - pitch) < 0.001;
      if (
        pausedRef.current &&
        rendered &&
        settled
      )
        return;
      rendered = true;
      if (!pausedRef.current) time += dt;
      const ease = reduced.matches ? 1 : 0.09;
      yaw += (target.current.yaw - yaw) * ease;
      pitch += (target.current.pitch - pitch) * ease;
      const angle = yaw;
      const size = errorMode
        ? Math.min(width / 3.3, height / 4.7)
        : Math.min(width / 4.1, height / 3.9);
      const project = ([a, b, c]) => {
        const xx = a * Math.cos(angle) + c * Math.sin(angle),
          zz = c * Math.cos(angle) - a * Math.sin(angle);
        const yy = b * Math.cos(pitch) - zz * Math.sin(pitch),
          z = b * Math.sin(pitch) + zz * Math.cos(pitch);
        const perspective = 5 / (5 - z);
        return [
          width / 2 + xx * size * perspective,
          height * 0.48 + (yy + Math.sin(time * 1.4) * 0.035) * size * perspective,
          z,
        ];
      };
      ctx.clearRect(0, 0, width, height);
      const halo = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        0,
        width / 2,
        height * 0.4,
        size * 1.9,
      );
      halo.addColorStop(0, '#a05aff28');
      halo.addColorStop(1, '#a05aff00');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);
      function path(points, color, weight = 0.7, fill) {
        ctx.beginPath();
        points.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        if (fill) {
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = weight;
        ctx.stroke();
      }
      if (!errorMode) {
        // Project the isolated KA monogram as a violet hologram above the robot's head.
        if (hologramLogo) {
          const logoWidth = hologramLogo.width;
          const logoHeight = hologramLogo.height;
          const topLeft = project([-0.7725, -2.002, 0.27]);
          const topRight = project([0.7275, -2.002, 0.27]);
          const bottomLeft = project([-0.7725, -0.802, 0.27]);
          ctx.save();
          ctx.transform(
            (topRight[0] - topLeft[0]) / logoWidth,
            (topRight[1] - topLeft[1]) / logoWidth,
            (bottomLeft[0] - topLeft[0]) / logoHeight,
            (bottomLeft[1] - topLeft[1]) / logoHeight,
            topLeft[0],
            topLeft[1],
          );
          ctx.globalAlpha = 0.32;
          ctx.globalCompositeOperation = 'screen';
          ctx.filter = 'hue-rotate(48deg) saturate(1.5)';
          ctx.drawImage(hologramLogo, 5, 0);
          ctx.filter = 'none';
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 0.88;
          ctx.shadowColor = '#a662ff';
          ctx.shadowBlur = 18;
          ctx.drawImage(hologramLogo, 0, 0);
          ctx.globalCompositeOperation = 'source-atop';
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = '#f3e5ff';
          for (let y = 8; y < logoHeight; y += 25) ctx.fillRect(0, y, logoWidth, 2);
          ctx.restore();
        }
      }
      const polys = [];
      for (const mesh of meshes) {
        const rows = mesh.rows.map((row) => row.map(project));
        rows.forEach((row, j) => {
          if (j === rows.length - 1) return;
          for (let k = 0; k < row.length - 1; k++) {
            const vertices = [row[k], row[k + 1], rows[j + 1][k + 1], rows[j + 1][k]];
            for (const triangle of [
              [vertices[0], vertices[1], vertices[2]],
              [vertices[0], vertices[2], vertices[3]],
            ]) {
              polys.push({
                vertices: triangle,
                depth: triangle.reduce((sum, p) => sum + p[2], 0) / 3,
                brain: mesh.brain,
              });
            }
          }
        });
      }
      polys.sort((a, b) => a.depth - b.depth);
      for (const poly of polys) {
        const a = 0.22 + Math.max(0, poly.depth) * 0.48;
        path(
          poly.vertices,
          `rgba(${poly.brain ? '222,175,255' : '180,133,255'},${a})`,
          poly.brain ? 0.8 : 0.65,
          `rgba(132,67,226,${poly.brain ? 0.12 : 0.12 + Math.max(0, poly.depth) * 0.26})`,
        );
      }
      if (errorMode) {
        // Swap the floating K on the hero robot for a question mark in its original spot.
        const symbol = project([0, -1.34, 0.27]);
        ctx.font = `700 ${size * 0.76}px Syne, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#d8b8ff';
        ctx.shadowColor = '#a662ff';
        ctx.shadowBlur = 13;
        ctx.fillText('?', symbol[0], symbol[1]);
        ctx.shadowBlur = 0;
      }
      // Face surface and illuminated expressions live on the front of the head.
      if (Math.cos(angle) > -0.15) {
        const face = [];
        for (let i = 0; i <= 60; i++) {
          const a = (i / 60) * Math.PI * 2;
          face.push(
            project([
              Math.sign(Math.cos(a)) * Math.pow(Math.abs(Math.cos(a)), 0.65) * 0.61,
              -0.28 + Math.sign(Math.sin(a)) * Math.pow(Math.abs(Math.sin(a)), 0.65) * 0.34,
              0.48,
            ]),
          );
        }
        path(face, '#d1a5ffb0', 1.3, '#100c22ee');
        ctx.shadowColor = '#be78ff';
        ctx.shadowBlur = 18;
        // The parent owns motion preferences and the explicit play/pause override.
        const blinkPhase = time % 3.8;
        const blink =
          blinkPhase > 0.8 && blinkPhase < 1.4
            ? Math.max(0.025, 1 - 1.2 * Math.sin(((blinkPhase - 0.8) / 0.6) * Math.PI) ** 2)
            : 1;
        if (errorMode) {
          for (const side of [-1, 1]) {
            const eye = project([side * 0.26, -0.26, 0.5]);
            const cross = size * 0.095;
            const weight = Math.max(3, size * 0.032);
            for (const diagonal of [
              [
                [eye[0] - cross, eye[1] - cross],
                [eye[0] + cross, eye[1] + cross],
              ],
              [
                [eye[0] + cross, eye[1] - cross],
                [eye[0] - cross, eye[1] + cross],
              ],
            ]) {
              path(diagonal, '#b67bff', weight + 1.5);
              path(diagonal, '#f2ddff', weight * 0.5);
            }
          }
        } else {
          for (const side of [-1, 1]) {
            const eye = Array.from({ length: 41 }, (_, i) => {
              const t = (i / 40) * Math.PI * 2;
              return project([
                side * 0.26 + Math.cos(t) * 0.115,
                -0.26 + Math.sin(t) * 0.13 * blink,
                0.5,
              ]);
            });
            path(eye, '#b67bff', 5);
            path(eye, '#f2ddff', 1.7);
          }
        }
        ctx.shadowBlur = 0;
      }
      const core = Array.from({ length: 33 }, (_, i) =>
        project([
          Math.cos((i / 32) * Math.PI * 2) * 0.09,
          0.6 + Math.sin((i / 32) * Math.PI * 2) * 0.09,
          0.35,
        ]),
      );
      path(core, '#d4a1ff', 1.5);
      for (let k = 0; k < 3; k++) {
        const ring = Array.from({ length: 65 }, (_, i) =>
          project([
            Math.cos((i / 64) * Math.PI * 2) * (1 + k * 0.15),
            1.55,
            Math.sin((i / 64) * Math.PI * 2) * (1 + k * 0.15),
          ]),
        );
        ctx.shadowColor = '#a95cff';
        ctx.shadowBlur = k === 0 ? 14 : 0;
        path(ring, k === 0 ? '#d1a5ff' : '#a064ff65', k === 0 ? 2 : 1);
        ctx.shadowBlur = 0;
      }
      const scanY = -0.95 + ((time * 0.3) % 2.3);
      path([project([-0.8, scanY, 0]), project([0.8, scanY, 0])], '#dfb9ff80', 1);
      for (let i = 0; i < 34; i++) {
        const p = project([
          Math.sin(i * 7.31) * 1.35,
          ((i * 0.371 + time * 0.07) % 3.3) - 1.7,
          Math.cos(i * 4.1) * 0.8,
        ]);
        if (
          errorMode &&
          Math.abs(p[0] - width / 2) < size * 0.9 &&
          Math.abs(p[1] - height * 0.48) < size * 1.65
        )
          continue;
        ctx.fillStyle = '#c49aff88';
        ctx.beginPath();
        ctx.arc(p[0], p[1], i % 4 ? 0.8 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!pausedRef.current || !settled) scheduleFrame();
    }
    wakeFrame();
    readyRef.current?.();
    return () => {
      stopFrame();
      if (wakeFrameRef.current === wakeFrame) wakeFrameRef.current = null;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer.disconnect();
      resize.disconnect();
    };
  }, [errorMode]);
  return (
    <div
      className={`volume-scene ${paused ? 'hologram-paused' : ''} ${errorMode ? 'volume-scene-error' : ''}`}
    >
      <div className="holo-dashboards" aria-hidden="true">
        <div className="holo-panel holo-code">
          <div className="holo-panel-title">
            <i /> {errorMode ? 'DIAGNÓSTICO' : 'SYSTEM / CODE'}{' '}
            <span>{errorMode ? errorCode : '01'}</span>
          </div>
          <div className="holo-code-lines">
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} style={{ paddingLeft: `${(i % 4) * 5}px` }}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span style={{ width: `${25 + ((i * 23) % 55)}%` }} />
                <em style={{ width: `${10 + (i % 3) * 6}%` }} />
              </div>
            ))}
          </div>
          <div className="holo-panel-footer">
            <i />
            {errorMode
              ? errorCode === 404
                ? 'ROTA NÃO ENCONTRADA'
                : 'SERVIDOR INDISPONÍVEL'
              : 'BUILD COMPLETE'}
          </div>
        </div>
        <div className="holo-panel holo-analytics">
          <div className="holo-panel-title">
            <i /> {errorMode ? 'STATUS DO SISTEMA' : 'ANALYTICS'}{' '}
            <span>{errorMode ? '!' : '02'}</span>
          </div>
          {errorMode ? (
            <div className="holo-error-state">
              <span>CÓDIGO</span>
              <strong>{errorCode}</strong>
              <i>{errorCode === 404 ? 'ROTA INVÁLIDA' : 'FALHA INTERNA'}</i>
            </div>
          ) : (
            <div className="holo-metrics">
              <div className="holo-donut" />
              <div>
                <span>NEURAL ACTIVITY</span>
                <strong>
                  98.4<small>%</small>
                </strong>
                <i>↑ SYSTEM ONLINE</i>
              </div>
            </div>
          )}
          <div className="holo-bars">
            {[35, 60, 45, 80, 65, 92, 75, 100].map((h, i) => (
              <i key={i} style={{ height: `${h}%`, animationDelay: `${-i * 0.4}s` }} />
            ))}
          </div>
        </div>
        <div className="holo-panel holo-signal">
          <div className="holo-panel-title">
            <i /> {errorMode ? 'LOG DE ERRO' : 'LIVE / SIGNAL'}{' '}
            <span>{errorMode ? '!' : '03'}</span>
          </div>
          <svg viewBox="0 0 160 55">
            <defs>
              <linearGradient id="signal-fill" x2="0" y2="1">
                <stop stopColor={errorMode ? '#ff8097' : '#b47aff'} stopOpacity=".35" />
                <stop offset="1" stopColor={errorMode ? '#ff8097' : '#b47aff'} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 43L15 40 25 45 40 25 55 29 70 12 85 23 100 16 115 20 130 7 145 13 160 4V55H0Z"
              fill="url(#signal-fill)"
            />
            <path
              d="M0 43L15 40 25 45 40 25 55 29 70 12 85 23 100 16 115 20 130 7 145 13 160 4"
              fill="none"
              stroke={errorMode ? '#ff9aaa' : '#d3a9ff'}
              strokeWidth="1.5"
            />
          </svg>
          <div className="holo-panel-footer">
            {errorMode ? '● SEM RESPOSTA' : '● CONNECTED'}
            {!errorMode && <span>24 ms</span>}
          </div>
        </div>
        <svg className="holo-connections" viewBox="0 0 500 500">
          <path d="M120 200H155L190 245M380 165H348L310 235M380 330H348L305 295" />
          <circle cx="190" cy="245" r="3" />
          <circle cx="310" cy="235" r="3" />
          <circle cx="305" cy="295" r="3" />
        </svg>
      </div>
      <canvas
        ref={canvasRef}
        className="robot-volume"
        role={errorMode ? 'img' : 'button'}
        tabIndex={errorMode ? undefined : 0}
        aria-label={
          errorMode
            ? 'Robô holográfico da página inicial, com olho em X e interrogação na cabeça.'
            : 'Explorar robô holográfico em 3D. Segure e arraste para girar ou use as setas do teclado.'
        }
        onPointerDown={errorMode ? undefined : down}
        onPointerMove={errorMode ? undefined : move}
        onPointerUp={errorMode ? undefined : up}
        onPointerCancel={
          errorMode
            ? undefined
            : () => {
                drag.current = null;
              }
        }
        onKeyDown={
          errorMode
            ? undefined
            : (e) => {
                if (
                  ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' '].includes(e.key)
                ) {
                  e.preventDefault();
                  if (e.key === 'Enter' || e.key === ' ') selectView((view + 1) % 4);
                  else {
                    target.current.yaw +=
                      e.key === 'ArrowLeft' ? -0.25 : e.key === 'ArrowRight' ? 0.25 : 0;
                    target.current.pitch = Math.max(
                      -0.6,
                      Math.min(
                        0.6,
                        target.current.pitch +
                          (e.key === 'ArrowUp' ? -0.1 : e.key === 'ArrowDown' ? 0.1 : 0),
                      ),
                    );
                    setView(-1);
                    wakeFrameRef.current?.();
                  }
                }
              }
        }
      />
      <div className="robot-views" role="group" aria-label="Ângulo do holograma">
        {['Frente', '¾', 'Lateral', 'Costas'].map((label, i) => (
          <button key={label} onClick={() => selectView(i)} aria-pressed={view === i}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
