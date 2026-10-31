export default function ServiceVisual({ step }) {
  const labels = ['Encontre a direção.', 'Dê forma à ideia.', 'Construa a experiência.', 'Conecte com o mundo.']
  return <div className={`process-emblem emblem-${step}`} aria-hidden="true">
    <svg viewBox="0 0 300 260" fill="none" className="emblem-svg">
      <defs><linearGradient id={`emblem-fill-${step}`} x1="40" y1="30" x2="260" y2="235" gradientUnits="userSpaceOnUse"><stop stopColor="#d4adff" stopOpacity=".25"/><stop offset="1" stopColor="#6d32b7" stopOpacity=".04"/></linearGradient></defs>
      <ellipse cx="150" cy="225" rx="85" ry="12" fill="#9455f5" opacity=".07"/>
      <g className="emblem-orbit" stroke="#a16aff" strokeOpacity=".16"><circle cx="150" cy="120" r="102" strokeDasharray="2 9"/><path d="M34 120H55M245 120H266M150 4V25M150 215V236"/></g>
      <g className="emblem-object" stroke="#c99aff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {step === 0 && <>
        <path d="M65 69L35 49M231 80L261 54M226 178L260 199M77 182L40 210" strokeOpacity=".4"/>
        <circle cx="35" cy="49" r="5"/><circle cx="261" cy="54" r="5"/><circle cx="260" cy="199" r="5"/><circle cx="40" cy="210" r="5"/>
        <circle cx="150" cy="120" r="80" fill="url(#emblem-fill-0)"/><circle cx="150" cy="120" r="67" strokeOpacity=".35"/>
        <path d="M150 48V59M150 181V192M78 120H89M211 120H222M99 69L107 77M193 163L201 171M99 171L107 163M193 77L201 69"/>
        <g className="compass-needle"><path d="M174 79L164 134 126 161 136 106Z" fill="#a368ee" fillOpacity=".25"/><path d="M174 79L150 120 136 106Z" fill="#d4b0ff"/><path d="M126 161L150 120 164 134Z" fill="#66359e"/><circle cx="150" cy="120" r="5" fill="#20152e"/></g>
      </>}
      {step === 1 && <>
        <path d="M65 69H156L191 103V207H65Z" fill="url(#emblem-fill-1)" strokeOpacity=".6"/><path d="M156 69V103H191M84 131H124M84 149H138M84 168H115M84 187H148" strokeOpacity=".3"/>
        <g transform="rotate(35 184 109)"><path d="M170 47Q170 39 184 39Q198 39 198 47V154L184 181 170 154Z" fill="#24172f"/><path d="M170 62H198V151H170Z" fill="url(#emblem-fill-1)"/><path d="M178 65V149M190 65V149M170 56H198M170 151H198"/><path d="M179 171L184 181 189 171" fill="#d9b7ff"/><path d="M198 68H207V105" strokeWidth="3"/></g>
        <path d="M201 195Q224 171 244 187M226 67V53M219 60H233" strokeOpacity=".6"/>
      </>}
      {step === 2 && <>
        <path d="M66 59Q66 50 75 50H225Q234 50 234 59V174H66Z" fill="url(#emblem-fill-2)"/>
        <path d="M77 64H223V163H77Z" fill="#18141f"/><circle cx="150" cy="57" r="1.5" fill="#c99aff"/>
        <path d="M66 174L42 204Q40 211 49 212H251Q260 211 258 204L234 174Z" fill="url(#emblem-fill-2)"/><path d="M42 204H258M126 190H174L180 199H120Z" strokeOpacity=".5"/>
        <path d="M121 96L103 112 121 128M179 96L197 112 179 128M158 90L142 134" strokeWidth="3" stroke="#dab7ff"/>
        <path d="M90 150H125M134 150H165" strokeOpacity=".35"/><circle cx="210" cy="150" r="3" fill="#bc85ff"/>
      </>}
      {step === 3 && <>
        <circle cx="150" cy="116" r="72" fill="url(#emblem-fill-3)"/>
        <g className="globe-lines"><ellipse cx="150" cy="116" rx="33" ry="72"/><ellipse cx="150" cy="116" rx="59" ry="72" strokeOpacity=".3"/><ellipse cx="150" cy="116" rx="72" ry="27"/><path d="M150 44V188M78 116H222M92 73Q150 102 208 73M92 159Q150 130 208 159" strokeOpacity=".6"/></g>
        <ellipse cx="150" cy="116" rx="109" ry="36" transform="rotate(-30 150 116)" stroke="#ad72ef" strokeOpacity=".7"/>
        <circle className="globe-node" cx="241" cy="64" r="6" fill="#d8b3ff"/><circle cx="97" cy="153" r="4" fill="#c99aff"/>
        <path d="M126 190V208H174V190M110 216H190" strokeOpacity=".4"/>
        <path d="M220 173H244V197H220Z" fill="#251831"/><path d="M225 185L230 190 239 179" strokeWidth="2"/>
      </>}
      </g>
    </svg>
    <span>{labels[step]}</span>
  </div>
}
