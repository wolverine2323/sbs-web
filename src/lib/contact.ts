// Enlaces de contacto a partir de los datos tal como se escriben en Sanity.

// "(506) 4000 3322" → "tel:+50640003322"
export function telHref(phone: string) {
  return `tel:+${phone.replace(/\D/g, "")}`;
}

export function mailtoHref(email: string) {
  return `mailto:${email}`;
}

// "+506 8888 8888" → "https://wa.me/50688888888?text=…"
export function whatsappHref(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
