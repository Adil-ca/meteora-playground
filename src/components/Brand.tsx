export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? 'small' : ''}`}>
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M3 24V13h5v11zm8 0V5h5v19zm8 0V10h5v14zm8 0V2h3v22z" fill="currentColor" />
        <path d="M3 29h27" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span>
        meteora<span className="brand-sub">PLAYGROUND</span>
      </span>
    </span>
  );
}
