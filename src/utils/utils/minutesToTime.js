export function convertMinutesToTime(minutes) {
  if (minutes < 0) return "Invalid time";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let result = [];

  if (hours > 0) {
    result.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  }
  if (remainingMinutes > 0) {
    result.push(`${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`);
  }

  return result.length > 0 ? result.join(" ") : "0 minutes";
}
