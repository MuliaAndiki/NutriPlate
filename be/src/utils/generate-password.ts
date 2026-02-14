export function generatePassword(lenght: number = 6): string {
  const digit = '0123456789';
  let password = '';
  for (let i = 0; i < lenght; i++) {
    password += digit[Math.floor(Math.random() * 10)];
  }
  return password;
}
