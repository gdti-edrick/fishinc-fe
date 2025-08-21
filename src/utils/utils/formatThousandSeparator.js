export function formatThousandSeparator(value) {
  if (value === "") return value;
  if (isNaN(value)) return value;

  return Number(value).toLocaleString("id-ID");
}
