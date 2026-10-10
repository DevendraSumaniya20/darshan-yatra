import { ink } from './inks';
import { Boat, Ghats, Gopuram, Palm, Peaks, Pine, Spire, StoneTemple, Waves } from './shapes';

/**
 * One horizon holding all four circuits, in the manner of printed pilgrimage maps:
 * Himalayan shrine, river ghats, a coastal temple and a southern gopuram.
 * Decorative; the page text carries the meaning.
 */
export function Panorama({ className }: { className?: string }) {
  const ground = 330;

  return (
    <svg
      className={className}
      viewBox="0 0 1200 380"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="pano-sun" cx={600} cy={236} r={158} fill={ink('red')} />

      <g className="pano-far">
      <Peaks
        from={-20}
        to={470}
        base={ground}
        peaks={[
          [58, 176],
          [190, 92],
          [318, 150],
        ]}
      />
      </g>
      <g className="pano-rise">
        <path d={`M-20 ${ground} Q120 268 250 300 T470 ${ground} Z`} fill={ink('deep')} />
        <Pine x={52} base={ground - 26} />
        <Pine x={88} base={ground - 16} height={38} />
        <Pine x={398} base={ground - 6} height={40} />
      </g>
      <g className="pano-rise">
        <StoneTemple x={236} base={ground - 28} />
      </g>

      <g className="pano-rise">
        <Spire x={520} base={ground - 33} width={50} height={104} fill="blue" flag="yellow" />
      </g>
      <g className="pano-rise">
        <Spire x={600} base={ground - 33} width={66} height={150} fill="paper" />
      </g>
      <g className="pano-rise">
        <Spire x={680} base={ground - 33} width={50} height={104} fill="blue" flag="yellow" />
      </g>
      <g className="pano-rise">
        <Ghats x={600} base={ground} width={330} />
      </g>

      <g className="pano-rise">
        <Spire x={846} base={ground} width={58} height={128} fill="blue" flag="yellow" />
        <path d={`M770 ${ground} a34 30 0 0 1 68 0 z`} fill={ink('blue')} />
        <rect x={762} y={ground - 6} width={120} height={6} fill={ink('paper')} />
      </g>

      <g className="pano-rise">
        <Palm x={920} base={ground} height={66} lean={-6} />
      </g>
      <g className="pano-rise">
        <Gopuram x={1010} base={ground} />
      </g>
      <g className="pano-rise">
        <Palm x={1104} base={ground} />
        <Palm x={1150} base={ground} height={74} lean={-8} />
      </g>

      <rect x={0} y={ground} width={1200} height={50} fill={ink('deep')} />
      <g className="pano-waves">
        <Waves from={-60} to={1260} y={ground + 20} />
      </g>
      <g className="pano-boat">
        <Boat x={742} base={ground + 4} />
      </g>
    </svg>
  );
}
