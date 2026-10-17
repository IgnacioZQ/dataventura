// Modelo de contenido de DataMind.
// Los tipos "de autoría" (Challenge, Island, Route) incluyen las respuestas y viven solo en el servidor.
// Los tipos "Public*" son lo único que viaja al navegador.

export type Tone = "neutral" | "accent" | "warn";
export type Difficulty = "BASIC" | "INTERMEDIATE" | "ADVANCED";

export type SkillId =
  | "calidad"
  | "distribucion"
  | "visualizacion"
  | "causalidad"
  | "muestreo"
  | "comparacion"
  | "incertidumbre";

export const skills: Record<SkillId, { label: string; description: string }> = {
  calidad: { label: "Calidad de datos", description: "Faltantes, duplicados y coherencia antes de analizar." },
  distribucion: { label: "Distribuciones y tendencias", description: "Centro, dispersión, extremos y patrones en el tiempo." },
  visualizacion: { label: "Lectura de gráficos", description: "Escalas, ejes y comparaciones visuales honestas." },
  causalidad: { label: "Causalidad", description: "Separar coincidencias de causas y diseñar pruebas justas." },
  muestreo: { label: "Muestras y sesgos", description: "Quién quedó fuera y cómo cambia la conclusión." },
  comparacion: { label: "Comparaciones y métricas", description: "Tasas, denominadores, definiciones y mezcla de grupos." },
  incertidumbre: { label: "Probabilidad e incertidumbre", description: "Tasas base, rangos plausibles y decisiones con riesgo." }
};

// ---------- Evidencia visual ----------
// Cada desafío describe sus propios datos; los componentes los dibujan.
// Los elementos con `id` pueden ser el objetivo de un desafío de tipo "pick".

export type TableEvidence = {
  kind: "table";
  title: string;
  columns: string[];
  rows: { id: string; cells: string[]; tone?: Tone }[];
  note?: string;
};

export type BarsEvidence = {
  kind: "bars";
  title: string;
  unit?: string;
  bars: { id: string; label: string; value: number; display?: string; tone?: Tone }[];
  /** Valor donde parte el eje. Por defecto 0. */
  baseline?: number;
  /** Si se define, dibuja un segundo panel con los mismos datos y este otro inicio de eje. */
  compareBaseline?: number;
  note?: string;
};

export type LinesEvidence = {
  kind: "lines";
  title: string;
  xLabels: string[];
  series: { id: string; label: string; values: number[] }[];
  /** true: cada serie se escala a su propio máximo (para comparar formas, no magnitudes). */
  normalize?: boolean;
  unit?: string;
  note?: string;
};

export type CompareEvidence = {
  kind: "compare";
  title: string;
  records: [CompareRecord, CompareRecord];
  note?: string;
};
export type CompareRecord = { id: string; label: string; fields: { key: string; value: string }[] };

export type StatsEvidence = {
  kind: "stats";
  title: string;
  items: { id: string; label: string; value: string; detail?: string; tone?: Tone }[];
  note?: string;
};

/** Cuadrícula de 100 puntos para mostrar proporciones. Los `count` deben sumar 100. */
export type GridEvidence = {
  kind: "grid";
  title: string;
  unitLabel: string;
  groups: { id: string; label: string; count: number; tone: Tone }[];
  note?: string;
};

/** Estimaciones con rango plausible (intervalos). */
export type IntervalEvidence = {
  kind: "interval";
  title: string;
  unit?: string;
  reference?: { value: number; label: string };
  items: { id: string; label: string; low: number; point: number; high: number }[];
  note?: string;
};

export type Evidence =
  | TableEvidence
  | BarsEvidence
  | LinesEvidence
  | CompareEvidence
  | StatsEvidence
  | GridEvidence
  | IntervalEvidence;

// ---------- Desafíos (autoría, con respuestas) ----------

type ChallengeBase = {
  id: string;
  /** Nombre corto del concepto que se entrena. */
  concept: string;
  prompt: string;
  context?: string;
  evidence?: Evidence;
  /** Pista que orienta sin dar la respuesta. */
  hint: string;
  /** Por qué la respuesta correcta lo es. Se muestra al acertar o al revelar. */
  explanation: string;
  /** La idea para llevarse, en una frase. Aparece en el resumen de la sesión. */
  takeaway: string;
};

export type ChoiceChallenge = ChallengeBase & {
  type: "choice";
  /** Cada opción incorrecta lleva `why`: por qué no alcanza. */
  options: { id: string; text: string; why?: string }[];
  correct: string;
};

export type MultiChallenge = ChallengeBase & {
  type: "multi";
  options: { id: string; text: string }[];
  correct: string[];
};

export type OrderChallenge = ChallengeBase & {
  type: "order";
  /** Escritos en el orden correcto. */
  items: { id: string; text: string }[];
};

export type NumericChallenge = ChallengeBase & {
  type: "numeric";
  answer: number;
  /** Margen absoluto aceptado. */
  tolerance: number;
  unit?: string;
};

export type PickChallenge = ChallengeBase & {
  type: "pick";
  /** id del elemento de la evidencia que hay que tocar. */
  correct: string;
  /** Opcional: por qué un elemento concreto no es la respuesta. */
  why?: Record<string, string>;
};

export type Challenge = ChoiceChallenge | MultiChallenge | OrderChallenge | NumericChallenge | PickChallenge;

export type Island = {
  slug: string;
  name: string;
  /** Tema de la isla, visible en el mapa. */
  topic: string;
  skill: SkillId;
  story: {
    /** Escena que abre la expedición. */
    opening: string;
    /** Cierre narrativo al completar la isla. */
    closing: string;
  };
  challenges: Challenge[];
};

export type Route = {
  slug: string;
  name: string;
  subtitle: string;
  level: string;
  difficulty: Difficulty;
  islands: Island[];
};

// ---------- Versiones públicas (sin respuestas) ----------

type PublicBase = Pick<ChallengeBase, "id" | "concept" | "prompt" | "context" | "evidence" | "hint">;

export type PublicChallenge =
  | (PublicBase & { type: "choice"; options: { id: string; text: string }[] })
  | (PublicBase & { type: "multi"; options: { id: string; text: string }[] })
  | (PublicBase & { type: "order"; items: { id: string; text: string }[] })
  | (PublicBase & { type: "numeric"; unit?: string })
  | (PublicBase & { type: "pick" });

export type Answer = string | string[] | number;

/** Lo que se muestra cuando el servidor revela la solución. */
export type Reveal = {
  /** ids correctos (choice, multi, pick) o el orden correcto (order). */
  correctIds: string[];
  /** Respuesta en texto, lista para mostrar. */
  answerText: string;
  explanation: string;
  takeaway: string;
};

export type PublicIsland = {
  slug: string;
  name: string;
  topic: string;
  skillLabel: string;
  challengeCount: number;
  maxXp: number;
};

export type PublicRoute = {
  slug: string;
  name: string;
  subtitle: string;
  level: string;
  difficulty: Difficulty;
  islands: PublicIsland[];
};
