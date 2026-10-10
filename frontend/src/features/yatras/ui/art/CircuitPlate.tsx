import type { ReactNode } from 'react';
import type { Circuit } from '../../model/yatra';
import { ink, type Ink } from './inks';
import { Boat, Ghats, Gopuram, Palm, Peaks, Pine, Spire, StoneTemple, Waves } from './shapes';
import './CircuitPlate.css';

type Scene = { sky: Ink; art: ReactNode };

const GROUND = 214;

const SCENES: Record<Circuit, Scene> = {
  'char-dham-himalaya': {
    sky: 'yellow',
    art: (
      <>
        <circle cx={312} cy={78} r={42} fill={ink('red')} />
        <Peaks
          from={-10}
          to={410}
          base={GROUND}
          peaks={[
            [70, 96],
            [188, 40],
            [300, 112],
          ]}
        />
        <path d={`M-10 ${GROUND} Q110 160 220 190 T410 180 V260 H-10 Z`} fill={ink('deep')} />
        <Pine x={46} base={GROUND - 12} />
        <Pine x={80} base={GROUND - 6} height={36} />
        <Pine x={350} base={GROUND - 20} height={42} />
        <StoneTemple x={206} base={GROUND + 6} />
      </>
    ),
  },
  jyotirlinga: {
    sky: 'red',
    art: (
      <>
        <circle cx={200} cy={118} r={84} fill={ink('yellow')} />
        <Spire x={120} base={GROUND - 33} width={48} height={96} fill="blue" flag="yellow" />
        <Spire x={200} base={GROUND - 33} width={64} height={140} fill="paper" flag="blue" />
        <Spire x={280} base={GROUND - 33} width={48} height={96} fill="blue" flag="yellow" />
        <Ghats x={200} base={GROUND} width={330} />
        <rect x={0} y={GROUND} width={400} height={46} fill={ink('deep')} />
        <Waves from={10} to={390} y={GROUND + 18} />
        <Boat x={318} base={GROUND + 4} />
      </>
    ),
  },
  'gujarat-west': {
    sky: 'blue',
    art: (
      <>
        <circle cx={88} cy={150} r={56} fill={ink('yellow')} />
        <rect x={0} y={GROUND - 26} width={400} height={72} fill={ink('deep')} />
        <Waves from={0} to={400} y={GROUND - 6} rows={3} />
        <path d={`M150 260 V${GROUND - 8} Q260 ${GROUND - 34} 400 ${GROUND - 22} V260 Z`} fill={ink('yellow')} />
        <Spire x={300} base={GROUND - 22} width={70} height={150} fill="paper" />
        <path d={`M196 ${GROUND - 14} a40 34 0 0 1 80 0 z`} fill={ink('paper')} />
        <rect x={186} y={GROUND - 20} width={160} height={8} fill={ink('red')} />
      </>
    ),
  },
  'south-india': {
    sky: 'pale',
    art: (
      <>
        <circle cx={300} cy={72} r={40} fill={ink('red')} />
        <Palm x={70} base={GROUND} height={120} lean={14} />
        <Palm x={112} base={GROUND} height={88} lean={-10} />
        <Palm x={338} base={GROUND} height={100} lean={10} />
        <Gopuram x={210} base={GROUND} width={136} tiers={6} tierHeight={27} />
        <rect x={0} y={GROUND} width={400} height={46} fill={ink('green')} />
        <path d={`M0 ${GROUND} H400`} stroke={ink('red')} strokeWidth={5} />
      </>
    ),
  },
};

type CircuitPlateProps = {
  circuit: Circuit;
  className?: string;
};

/** The picture for a circuit. Decorative: the circuit is always named in text beside it. */
export function CircuitPlate({ circuit, className }: CircuitPlateProps) {
  const scene = SCENES[circuit];

  return (
    <svg
      className={`circuit-plate${className ? ` ${className}` : ''}`}
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect width={400} height={260} fill={ink(scene.sky)} />
      {scene.art}
    </svg>
  );
}
