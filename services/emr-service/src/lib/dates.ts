/**
 * Calculates the number of complete years between two dates.
 * Used for computing patient age from date of birth.
 */
export function differenceInYears(laterDate: Date, earlierDate: Date): number {
  let years = laterDate.getFullYear() - earlierDate.getFullYear()
  const monthDiff = laterDate.getMonth() - earlierDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && laterDate.getDate() < earlierDate.getDate())) {
    years--
  }
  return years
}
