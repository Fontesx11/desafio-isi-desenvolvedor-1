// Mantém as linhas com 1 px em qualquer tamanho do campo
const thinLine = { vectorEffect: 'non-scaling-stroke' } as const;

// Linhas do campo, só decoração, nas medidas do Figma (1200 × 700).
// O SVG acompanha o tamanho do campo; some abaixo de lg.
export function PitchMarkings() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 700"
      className="pointer-events-none absolute inset-0 hidden size-full overflow-visible fill-none stroke-zinc-200 lg:block"
    >
      <line x1={600} y1={0} x2={600} y2={700} {...thinLine} />
      <circle cx={600} cy={350} r={150} {...thinLine} />
      <PenaltyArea />
      <g transform="translate(1200 0) scale(-1 1)">
        <PenaltyArea />
      </g>
    </svg>
  );
}

// Lado esquerdo do campo; o direito é o mesmo desenho espelhado
function PenaltyArea() {
  return (
    <>
      <path d="M0 175 H170 V525 H0" {...thinLine} />
      <path d="M0 270 H60 V430 H0" {...thinLine} />
      <path d="M170 278.8 A90 90 0 0 1 170 421.2" {...thinLine} />
      <path d="M0 310 H-16 V390 H0" {...thinLine} />
      <circle cx={115} cy={350} r={3} className="fill-zinc-300 stroke-none" />
    </>
  );
}
