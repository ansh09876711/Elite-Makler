export const ADMIN_EMAILS = [
  'vaishnoshreeconstruction@gmail.com',
  'admin@elitemakler.in',
]

export function isAdminEmail(email: string | undefined | null): boolean {
  return ADMIN_EMAILS.some(e => e.toLowerCase() === email?.toLowerCase())
}
