// Botones rectos, en mayúsculas con letter-spacing 0.1em (CLAUDE.md).
// min-h en vez de h para que un texto largo pueda pasar a dos líneas sin romperse.
export const buttonBase =
  "items-center justify-center gap-3.5 text-center font-semibold tracking-[0.1em] uppercase transition-colors duration-200";

export const buttonSizes = {
  sm: "min-h-12 px-[22px] text-[13px]", // header
  md: "min-h-14 px-7 text-[13px]",
  lg: "min-h-[60px] px-[34px] text-sm", // hero, reserva, contacto
};

export type ButtonSize = keyof typeof buttonSizes;
