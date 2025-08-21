import { format, parse, parseISO } from "date-fns";

export function formatStringUppercase(input) {
  // Split the input string by hyphen
  const words = input.split("-");

  // Capitalize the first letter of each word and join with space
  const formattedString = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return formattedString;
}

export function convertToIsoDate(input) {
  try {
    const parsed = parse(input, "dd-MM-yyyy HH:mm:ss", new Date());
    return format(parsed, "yyyy-MM-dd");
  } catch (error) {
    console.error("Invalid date format:", input);
    return "";
  }
}

export function convertIsoToDateOnly(isoString) {
  try {
    const date = parseISO(isoString);
    return format(date, "yyyy-MM-dd");
  } catch (error) {
    console.error("Invalid ISO string:", isoString);
    return "";
  }
}

export function convertToCustomDateTime(input, time = "00:00:00") {
  try {
    const date = parseISO(input); // parses "2025-05-12"
    const [hours, minutes, seconds] = time.split(":").map(Number);
    date.setHours(hours, minutes, seconds);
    return format(date, "dd-MM-yyyy HH:mm:ss");
  } catch (error) {
    console.error("Invalid input date:", input);
    return "";
  }
}
