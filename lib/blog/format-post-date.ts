function parseSanityDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parts = value.split("-").map(Number);
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    if (year === undefined || month === undefined || day === undefined) {
      return new Date(NaN);
    }

    return new Date(Date.UTC(year, month - 1, day));
  }

  return new Date(value);
}

export function formatPostDate(isoDate: string): string {
  const parsed = parseSanityDate(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
