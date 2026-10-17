"use client";

import type {
  BarsEvidence, CompareEvidence, Evidence, GridEvidence, IntervalEvidence, LinesEvidence, StatsEvidence, TableEvidence, Tone
} from "@/content/types";
import { formatNumber } from "@/lib/format";

/** Estado de selección cuando la evidencia es la respuesta (desafíos "pick"). */
export type PickState = {
  selected: string | null;
  onSelect: (id: string) => void;
  locked: boolean;
  correctId: string | null;
  wrongId: string | null;
};

const SERIES_COLORS = ["#b79cff", "#83edbd", "#ffc56b"];

function toneClass(tone: Tone | undefined) {
  return tone && tone !== "neutral" ? `ev-tone-${tone}` : "";
}

function pickClass(pick: PickState | undefined, id: string) {
  if (!pick) return "";
  if (pick.correctId === id) return "ev-pick ev-pick-correct";
  if (pick.wrongId === id) return "ev-pick ev-pick-wrong";
  if (pick.selected === id) return "ev-pick ev-pick-selected";
  return "ev-pick";
}

/** Un elemento de evidencia: botón si se puede elegir, bloque normal si no. */
function Item({
  id, pick, className, label, children, style
}: {
  id: string;
  pick?: PickState;
  className: string;
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  if (!pick) return <div className={className} style={style}>{children}</div>;
  return (
    <button
      type="button"
      className={`${className} ${pickClass(pick, id)}`}
      style={style}
      aria-label={label}
      aria-pressed={pick.selected === id}
      disabled={pick.locked}
      onClick={() => pick.onSelect(id)}
    >
      {children}
    </button>
  );
}

function Table({ evidence, pick }: { evidence: TableEvidence; pick?: PickState }) {
  const columns = { gridTemplateColumns: `minmax(0, 1.5fr) repeat(${evidence.columns.length - 1}, minmax(0, 1fr))` };
  return (
    <div className="ev-table" role="table" aria-label={evidence.title}>
      <div className="ev-table-head" role="row" style={columns}>
        {evidence.columns.map((column) => <span key={column} role="columnheader">{column}</span>)}
      </div>
      {evidence.rows.map((row) => (
        <Item
          key={row.id}
          id={row.id}
          pick={pick}
          className={`ev-table-row ${toneClass(row.tone)}`}
          label={row.cells.join(", ")}
          style={columns}
        >
          {row.cells.map((cell, index) => <span key={index}>{cell}</span>)}
        </Item>
      ))}
    </div>
  );
}

function BarPanel({ evidence, baseline, caption, pick }: { evidence: BarsEvidence; baseline: number; caption?: string; pick?: PickState }) {
  const max = Math.max(...evidence.bars.map((bar) => bar.value));
  const span = max - baseline || 1;
  return (
    <figure className="ev-bars-panel">
      {caption && <figcaption>{caption}</figcaption>}
      <div className="ev-bars" style={{ gridTemplateColumns: `repeat(${evidence.bars.length}, minmax(0, 1fr))` }}>
        {evidence.bars.map((bar, index) => {
          const text = bar.display ?? formatNumber(bar.value, evidence.unit);
          const height = Math.max(3, ((bar.value - baseline) / span) * 100);
          return (
            <Item key={bar.id} id={bar.id} pick={pick} className={`ev-bar ${toneClass(bar.tone)}`} label={`${bar.label}: ${text}`}>
              <span className="ev-bar-value">{text}</span>
              <span className="ev-bar-track">
                <span className="ev-bar-fill" style={{ height: `${height}%`, animationDelay: `${index * 70}ms` }} />
              </span>
              <span className="ev-bar-label">{bar.label}</span>
            </Item>
          );
        })}
      </div>
      <span className="ev-axis-note">El eje parte en {formatNumber(baseline, evidence.unit)}</span>
    </figure>
  );
}

function Bars({ evidence, pick }: { evidence: BarsEvidence; pick?: PickState }) {
  const baseline = evidence.baseline ?? 0;
  if (evidence.compareBaseline === undefined) return <BarPanel evidence={evidence} baseline={baseline} pick={pick} />;
  return (
    <div className="ev-bars-duo">
      <BarPanel evidence={evidence} baseline={baseline} caption="Gráfico 1" />
      <BarPanel evidence={evidence} baseline={evidence.compareBaseline} caption="Gráfico 2" />
    </div>
  );
}

function Lines({ evidence }: { evidence: LinesEvidence }) {
  const width = 320;
  const height = 150;
  const pad = { left: 10, right: 14, top: 14, bottom: 8 };
  const all = evidence.series.flatMap((series) => series.values);
  const globalMax = Math.max(...all);
  const globalMin = Math.min(0, ...all);
  const steps = Math.max(1, evidence.xLabels.length - 1);

  const paths = evidence.series.map((series) => {
    const max = evidence.normalize ? Math.max(...series.values) : globalMax;
    const min = evidence.normalize ? 0 : globalMin;
    const points = series.values.map((value, index) => ({
      x: pad.left + (index / steps) * (width - pad.left - pad.right),
      y: pad.top + (1 - (value - min) / (max - min || 1)) * (height - pad.top - pad.bottom)
    }));
    return { series, points, d: points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ") };
  });

  const summary = evidence.series
    .map((series) => `${series.label}: ${series.values.map((value) => formatNumber(value, evidence.unit)).join(", ")}`)
    .join(". ");

  return (
    <div className="ev-lines">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${evidence.title}. ${summary}`}>
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <line key={ratio} x1={pad.left} x2={width - pad.right} y1={pad.top + ratio * (height - pad.top - pad.bottom)} y2={pad.top + ratio * (height - pad.top - pad.bottom)} className="ev-gridline" />
        ))}
        {paths.map(({ series, points, d }, index) => (
          <g key={series.id} style={{ color: SERIES_COLORS[index % SERIES_COLORS.length] }}>
            <path d={d} pathLength={1} className="ev-line" style={{ animationDelay: `${index * 180}ms` }} />
            {points.map((point, pointIndex) => <circle key={pointIndex} cx={point.x} cy={point.y} r={3.4} className="ev-line-dot" />)}
          </g>
        ))}
      </svg>
      <div className="ev-x-labels" style={{ gridTemplateColumns: `repeat(${evidence.xLabels.length}, minmax(0, 1fr))` }}>
        {evidence.xLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <ul className="ev-legend">
        {evidence.series.map((series, index) => (
          <li key={series.id}><i style={{ background: SERIES_COLORS[index % SERIES_COLORS.length] }} />{series.label}</li>
        ))}
      </ul>
    </div>
  );
}

function Compare({ evidence }: { evidence: CompareEvidence }) {
  const [left, right] = evidence.records;
  return (
    <div className="ev-compare">
      {[left, right].map((record, side) => {
        const other = side === 0 ? right : left;
        return (
          <div key={record.id} className="ev-compare-card">
            <strong>{record.label}</strong>
            <dl>
              {record.fields.map((field, index) => {
                const differs = other.fields[index]?.value !== field.value;
                return (
                  <div key={field.key} className={differs ? "ev-compare-differs" : ""}>
                    <dt>{field.key}</dt>
                    <dd>{field.value}{differs && <span className="sr-only"> (distinto)</span>}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        );
      })}
    </div>
  );
}

function Stats({ evidence, pick }: { evidence: StatsEvidence; pick?: PickState }) {
  return (
    <div className="ev-stats">
      {evidence.items.map((item) => (
        <Item key={item.id} id={item.id} pick={pick} className={`ev-stat ${toneClass(item.tone)}`} label={`${item.label}: ${item.value}`}>
          <span className="ev-stat-label">{item.label}</span>
          <strong>{item.value}</strong>
          {item.detail && <small>{item.detail}</small>}
        </Item>
      ))}
    </div>
  );
}

function Grid({ evidence }: { evidence: GridEvidence }) {
  const dots = evidence.groups.flatMap((group) => Array.from({ length: group.count }, () => group.tone));
  return (
    <div className="ev-grid">
      <div className="ev-grid-dots" role="img" aria-label={evidence.groups.map((group) => `${group.label}: ${group.count} de 100`).join(". ")}>
        {dots.map((tone, index) => <i key={index} className={`ev-dot ev-dot-${tone}`} style={{ animationDelay: `${index * 6}ms` }} />)}
      </div>
      <ul className="ev-legend">
        {evidence.groups.map((group) => (
          <li key={group.id}><i className={`ev-dot ev-dot-${group.tone}`} />{group.label} <b>{group.count}</b></li>
        ))}
      </ul>
      <span className="ev-axis-note">{evidence.unitLabel}</span>
    </div>
  );
}

function Interval({ evidence }: { evidence: IntervalEvidence }) {
  const values = evidence.items.flatMap((item) => [item.low, item.high]);
  if (evidence.reference) values.push(evidence.reference.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = (rawMax - rawMin || 1) * 0.08;
  const min = rawMin - padding;
  const span = rawMax + padding - min;
  const at = (value: number) => `${((value - min) / span) * 100}%`;
  const signed = (value: number) => `${value > 0 ? "+" : ""}${formatNumber(value, evidence.unit)}`;

  return (
    <div className="ev-interval">
      {evidence.items.map((item) => (
        <div key={item.id} className="ev-interval-row">
          <span className="ev-interval-label">
            {item.label}
            <b>{signed(item.point)}</b>
          </span>
          <div className="ev-interval-track" role="img" aria-label={`${item.label}: estimación ${signed(item.point)}, rango de ${signed(item.low)} a ${signed(item.high)}`}>
            {evidence.reference && <i className="ev-interval-reference" style={{ left: at(evidence.reference.value) }} />}
            <i className="ev-interval-range" style={{ left: at(item.low), width: `calc(${at(item.high)} - ${at(item.low)})` }} />
            <i className="ev-interval-point" style={{ left: at(item.point) }} />
          </div>
          <span className="ev-interval-ends"><span>{signed(item.low)}</span><span>{signed(item.high)}</span></span>
        </div>
      ))}
      {evidence.reference && <span className="ev-axis-note">Línea punteada: {evidence.reference.label}</span>}
    </div>
  );
}

export function EvidenceView({ evidence, pick }: { evidence: Evidence; pick?: PickState }) {
  return (
    <section className={`ev ${pick ? "ev-pickable" : ""}`} aria-label="Evidencia">
      <header className="ev-title">
        <span aria-hidden="true">◈</span>
        {evidence.title}
      </header>
      {evidence.kind === "table" && <Table evidence={evidence} pick={pick} />}
      {evidence.kind === "bars" && <Bars evidence={evidence} pick={pick} />}
      {evidence.kind === "lines" && <Lines evidence={evidence} />}
      {evidence.kind === "compare" && <Compare evidence={evidence} />}
      {evidence.kind === "stats" && <Stats evidence={evidence} pick={pick} />}
      {evidence.kind === "grid" && <Grid evidence={evidence} />}
      {evidence.kind === "interval" && <Interval evidence={evidence} />}
      {evidence.note && <p className="ev-note">{evidence.note}</p>}
    </section>
  );
}
