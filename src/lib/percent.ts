// src/lib/percent.ts
export function normalizePercents(values: number[]) {
  const sum = values.reduce((s, v) => s + (isFinite(v) ? v : 0), 0) || 1;
  const raw = values.map(v => (v / sum) * 100);
  // arrondir et corriger l'écart pour obtenir 100 pile
  const rounded = raw.map(v => Math.round(v));
  const diff = 100 - rounded.reduce((s, v) => s + v, 0);
  if (diff !== 0) {
    // pousser l'écart sur l’index qui a le plus grand reste
    const rema = raw.map((v, i) => ({ i, r: v - Math.floor(v) }))
                    .sort((a, b) => b.r - a.r);
    for (let k = 0; k < Math.abs(diff); k++) {
      const idx = rema[k % rema.length].i;
      rounded[idx] += diff > 0 ? 1 : -1;
    }
  }
  return rounded;
}
