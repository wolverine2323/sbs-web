// 1 → "01", como los números de servicios, pasos y testimonios de la referencia.
export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
