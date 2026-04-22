export type ContactMessage = {
  id: string
  createdAt: string
  name: string
  email: string
  phone: string
  message: string
}

export type ContactMessagesStorage = {
  messages: ContactMessage[]
}

const MAX_NAME = 120
const MAX_EMAIL = 254
const MAX_PHONE = 40
const MAX_MESSAGE = 8000

export function clampContactFields(input: {
  name: string
  email: string
  phone: string
  message: string
}): { name: string; email: string; phone: string; message: string } {
  return {
    name: input.name.trim().slice(0, MAX_NAME),
    email: input.email.trim().slice(0, MAX_EMAIL),
    phone: input.phone.trim().slice(0, MAX_PHONE),
    message: input.message.trim().slice(0, MAX_MESSAGE),
  }
}

export function normalizeContactMessagesValue(value: unknown): ContactMessage[] {
  if (value == null) return []
  if (Array.isArray(value)) {
    return value.filter(isMessageRecord)
  }
  if (typeof value === 'object' && value !== null && 'messages' in value) {
    const m = (value as { messages?: unknown }).messages
    return normalizeContactMessagesValue(m)
  }
  return []
}

function isMessageRecord(x: unknown): x is ContactMessage {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.createdAt === 'string' &&
    typeof o.name === 'string' &&
    typeof o.email === 'string' &&
    typeof o.phone === 'string' &&
    typeof o.message === 'string'
  )
}

export function toContactMessagesStorage(messages: ContactMessage[]): ContactMessagesStorage {
  return { messages }
}
