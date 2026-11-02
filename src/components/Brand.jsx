// Viewports reuse the supplied artwork unchanged, including its custom lettering.
export function LogoArtwork({ variant = 'full', className = '' }) {
  const viewBox = variant === 'wordmark' ? '230 783 800 82'
    : variant === 'monogram' ? '430 498 410 245' : '170 190 910 820';
  return <svg className={`ka-artwork ka-${variant} ${className}`} viewBox={viewBox} aria-hidden="true" focusable="false">
    <image href="/brand/logo-ka.png" width="1254" height="1254" />
  </svg>;
}

export default function Brand({ href = '#inicio', className = '' }) {
  return <a href={href} className={`brand ka-brand ${className}`} aria-label="Kaio Amim, início">
    <span className="ka-brand-symbol"><LogoArtwork variant="monogram" /></span>
    <LogoArtwork variant="wordmark" />
  </a>;
}
