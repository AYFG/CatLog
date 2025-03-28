export function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
}
