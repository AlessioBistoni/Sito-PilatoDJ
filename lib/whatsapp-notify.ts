/**
 * Notifica WhatsApp lato server tramite CallMeBot (https://www.callmebot.com/).
 * Il numero di destinazione e l’API key restano solo in variabili d’ambiente:
 * non vanno mai esposti al browser.
 *
 * Setup: apri il link di attivazione CallMeBot dal tuo WhatsApp, ottieni l’apikey,
 * poi imposta CALLMEBOT_PHONE e CALLMEBOT_API_KEY in .env.local (Vercel in produzione).
 */
export async function notifyContactViaWhatsApp(text: string): Promise<void> {
  const phone = process.env.CALLMEBOT_PHONE?.replace(/\D/g, '') ?? ''
  const apiKey = process.env.CALLMEBOT_API_KEY?.trim() ?? ''
  if (!phone || !apiKey) {
    return
  }

  const maxLen = 3500
  const body = text.length > maxLen ? `${text.slice(0, maxLen - 20)}… [troncato]` : text
  const url = new URL('https://api.callmebot.com/whatsapp.php')
  url.searchParams.set('phone', phone)
  url.searchParams.set('apikey', apiKey)
  url.searchParams.set('text', body)

  const res = await fetch(url.toString(), { method: 'GET', cache: 'no-store' })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    console.warn('[whatsapp-notify] CallMeBot HTTP', res.status, t.slice(0, 200))
  }
}

export function formatContactWhatsAppBody(m: {
  name: string
  email: string
  phone: string
  message: string
}): string {
  const lines = [
    '🔔 *Nuovo messaggio dal sito*',
    '',
    `*Nome:* ${m.name}`,
    `*Email:* ${m.email}`,
    m.phone ? `*Tel:* ${m.phone}` : '*Tel:* (non indicato)',
    '',
    '*Messaggio:*',
    m.message,
  ]
  return lines.join('\n')
}
