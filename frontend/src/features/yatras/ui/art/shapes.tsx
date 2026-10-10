/*
 * Building blocks for the picture plates: flat shapes in the four print inks,
 * drawn the way a bazaar calendar printer would cut them. Colours come from tokens.
 */

import { ink, type Ink } from './inks';

type Point = { x: number; base: number };

/** A north Indian shikhara: curved spire, ribbed disc, finial and flag. */
export function Spire({
  x,
  base,
  width,
  height,
  fill,
  flag = 'red',
}: Point & { width: number; height: number; fill: Ink; flag?: Ink }) {
  const half = width / 2;
  const top = base - height;
  const body = [
    `M${x - half} ${base}`,
    `C${x - half} ${base - height * 0.62} ${x - width * 0.16} ${top + height * 0.06} ${x} ${top}`,
    `C${x + width * 0.16} ${top + height * 0.06} ${x + half} ${base - height * 0.62} ${x + half} ${base}`,
    'Z',
  ].join(' ');
  const bands = [0.28, 0.5, 0.72].map((step) => base - height * step);

  return (
    <g>
      <path d={body} fill={ink(fill)} />
      {bands.map((y) => (
        <path
          key={y}
          d={`M${x - half * 0.72} ${y} H${x + half * 0.72}`}
          stroke={ink(flag)}
          strokeWidth={2}
          opacity={0.55}
        />
      ))}
      <ellipse cx={x} cy={top - 3} rx={width * 0.2} ry={5} fill={ink(flag)} />
      <path d={`M${x} ${top - 8} V${top - 40}`} stroke={ink(flag)} strokeWidth={3} />
      <path d={`M${x} ${top - 40} l22 7 l-22 7 z`} fill={ink(flag)} />
    </g>
  );
}

/** The squat stone temple of the high Himalaya: a hall with a short curved tower. */
export function StoneTemple({ x, base, fill = 'paper' }: Point & { fill?: Ink }) {
  return (
    <g>
      <Spire x={x} base={base - 34} width={46} height={54} fill={fill} />
      <rect x={x - 34} y={base - 36} width={68} height={36} fill={ink(fill)} />
      <path d={`M${x - 40} ${base - 36} H${x + 40}`} stroke={ink('red')} strokeWidth={4} />
      <path
        d={`M${x - 8} ${base} v-18 a8 8 0 0 1 16 0 v18 z`}
        fill={ink('deep')}
      />
    </g>
  );
}

/** A south Indian gopuram: stacked tiers narrowing to a barrel roof with finials. */
export function Gopuram({
  x,
  base,
  width = 124,
  tiers = 6,
  tierHeight = 26,
}: Point & { width?: number; tiers?: number; tierHeight?: number }) {
  const step = (width * 0.62) / tiers;
  const levels = Array.from({ length: tiers }, (_, index) => {
    const lower = width - index * step;
    const upper = width - (index + 1) * step + 6;
    const y = base - index * tierHeight;
    return { index, lower, upper, y };
  });
  const roofY = base - tiers * tierHeight;
  const roofWidth = width - tiers * step + 10;

  return (
    <g>
      {levels.map(({ index, lower, upper, y }) => (
        <g key={index}>
          <path
            d={`M${x - lower / 2} ${y} L${x - upper / 2} ${y - tierHeight} H${x + upper / 2} L${x + lower / 2} ${y} Z`}
            fill={ink(index % 2 === 0 ? 'yellow' : 'paper')}
          />
          <path
            d={`M${x - lower / 2 - 4} ${y} H${x + lower / 2 + 4}`}
            stroke={ink('red')}
            strokeWidth={4}
          />
          {index > 0 && (
            <rect x={x - 5} y={y - tierHeight + 7} width={10} height={12} fill={ink('red')} />
          )}
        </g>
      ))}
      <path d={`M${x - 11} ${base} v-17 a11 11 0 0 1 22 0 v17 z`} fill={ink('deep')} />
      <path
        d={`M${x - roofWidth / 2} ${roofY} a${roofWidth / 2} 17 0 0 1 ${roofWidth} 0 z`}
        fill={ink('red')}
      />
      {[-0.3, 0, 0.3].map((offset) => (
        <circle
          key={offset}
          cx={x + roofWidth * offset}
          cy={roofY - 19 + Math.abs(offset) * 14}
          r={4}
          fill={ink('yellow')}
        />
      ))}
    </g>
  );
}

export function Palm({ x, base, height = 96, lean = 10 }: Point & { height?: number; lean?: number }) {
  const topX = x + lean;
  const topY = base - height;
  const fronds = [-150, -115, -78, -40, -8, 24];

  return (
    <g>
      <path
        d={`M${x} ${base} Q${x - lean * 0.6} ${base - height / 2} ${topX} ${topY}`}
        stroke={ink('deep')}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
      {fronds.map((angle) => (
        <ellipse
          key={angle}
          cx={topX + 24}
          cy={topY}
          rx={26}
          ry={7}
          fill={ink('green')}
          transform={`rotate(${angle} ${topX} ${topY})`}
        />
      ))}
    </g>
  );
}

export function Pine({ x, base, height = 46, fill = 'deep' }: Point & { height?: number; fill?: Ink }) {
  const half = height * 0.3;
  return (
    <path
      d={`M${x} ${base - height} L${x + half} ${base - height * 0.4} H${x + half * 0.5} L${x + half * 1.2} ${base} H${x - half * 1.2} L${x - half * 0.5} ${base - height * 0.4} H${x - half} Z`}
      fill={ink(fill)}
    />
  );
}

/** A range of peaks with snow caps. `peaks` are [x, y] summits, left to right. */
export function Peaks({
  from,
  to,
  base,
  peaks,
  fill = 'blue',
}: {
  from: number;
  to: number;
  base: number;
  peaks: ReadonlyArray<readonly [number, number]>;
  fill?: Ink;
}) {
  const outline = [`M${from} ${base}`];
  peaks.forEach(([px, py], index) => {
    const previous = peaks[index - 1];
    if (previous) {
      // The saddle between two summits.
      const saddleX = (previous[0] + px) / 2;
      const saddleY = Math.max(previous[1], py) + (base - Math.max(previous[1], py)) * 0.42;
      outline.push(`L${saddleX} ${saddleY}`);
    }
    outline.push(`L${px} ${py}`);
  });
  outline.push(`L${to} ${base} Z`);

  return (
    <g>
      <path d={outline.join(' ')} fill={ink(fill)} />
      {peaks.map(([px, py]) => {
        const size = (base - py) * 0.2;
        return (
          <path
            key={px}
            d={`M${px} ${py} l${size * 0.62} ${size} l-${size * 0.3} -${size * 0.14} l-${size * 0.3} ${size * 0.42} l-${size * 0.34} -${size * 0.46} l-${size * 0.3} ${size * 0.2} z`}
            fill={ink('paper')}
          />
        );
      })}
    </g>
  );
}

/** Rows of small crests on water. */
export function Waves({
  from,
  to,
  y,
  rows = 2,
  stroke = 'paper',
}: {
  from: number;
  to: number;
  y: number;
  rows?: number;
  stroke?: Ink;
}) {
  const crests: string[] = [];
  for (let row = 0; row < rows; row += 1) {
    const offset = row % 2 === 0 ? 0 : 36;
    for (let x = from + offset; x + 44 <= to; x += 72) {
      crests.push(`M${x} ${y + row * 15} q11 -9 22 0 t22 0`);
    }
  }
  return (
    <path
      d={crests.join(' ')}
      stroke={ink(stroke)}
      strokeWidth={3}
      fill="none"
      strokeLinecap="round"
    />
  );
}

/** Stepped river ghats, widest at the water. */
export function Ghats({ x, base, width, steps = 3, fill = 'paper' }: Point & { width: number; steps?: number; fill?: Ink }) {
  return (
    <g>
      {Array.from({ length: steps }, (_, index) => {
        const inset = index * 18;
        return (
          <rect
            key={index}
            x={x - width / 2 + inset}
            y={base - (index + 1) * 11}
            width={width - inset * 2}
            height={11}
            fill={ink(index % 2 === 0 ? fill : 'pale')}
          />
        );
      })}
    </g>
  );
}

export function Boat({ x, base }: Point) {
  return (
    <g>
      <path d={`M${x - 46} ${base - 12} H${x + 46} L${x + 30} ${base + 6} H${x - 30} Z`} fill={ink('paper')} />
      <path d={`M${x - 46} ${base - 12} H${x + 46}`} stroke={ink('red')} strokeWidth={4} />
      <path d={`M${x - 6} ${base - 12} V${base - 44}`} stroke={ink('paper')} strokeWidth={3} />
      <path d={`M${x - 6} ${base - 44} l20 6 l-20 6 z`} fill={ink('yellow')} />
    </g>
  );
}
