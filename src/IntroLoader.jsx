import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Original implementation inspired by kennyotsu's vertical-word loader:
// https://uiverse.io/kennyotsu/fresh-lizard-20
export default function IntroLoader({ onReady }) {
  const [visible, setVisible] = useState(true)
  const reduced = useReducedMotion()
  useEffect(() => {
    let disposed = false, minimum
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const done = () => { if (!disposed) { setVisible(false); onReady(); document.body.style.overflow = previous } }
    const deadline = setTimeout(done, 2500)
    Promise.all([document.fonts?.ready || Promise.resolve(), new Promise(resolve => { minimum = setTimeout(resolve, reduced ? 0 : 900) })]).then(done)
    return () => { disposed = true; clearTimeout(deadline); clearTimeout(minimum); document.body.style.overflow = previous }
  }, [onReady, reduced])
  return <AnimatePresence>{visible && <motion.div className="intro-loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .3 }}>
    <span className="intro-signature">KAIO AMIM / PORTFOLIO</span>
    <div role="status" aria-label="Carregando portfólio" className="intro-word-loader"><span aria-hidden="true">Carregando</span><div className="intro-words" aria-hidden="true"><div><span>ideias</span><span>interfaces</span><span>projetos</span><span>conexões</span><span>ideias</span></div></div></div>
    <button onClick={() => { setVisible(false); onReady(); document.body.style.overflow = '' }}>Entrar no portfólio <span aria-hidden="true">↗</span></button>
  </motion.div>}</AnimatePresence>
}
