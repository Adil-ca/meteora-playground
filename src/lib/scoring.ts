export function scoreTick(chips: number, activity: number, streak: number, penalty: number) {
  return chips > 0 ? (10 + 5 * chips) * activity + 2 * Math.min(streak, 10) : -penalty;
}
