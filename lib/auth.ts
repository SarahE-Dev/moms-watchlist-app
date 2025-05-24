const ADMIN_PASSWORD = "Rosie" // You can change this

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}
