import fs from "node:fs";
import path from "node:path";

const STATIC_SEEDS = ["rana@test.com", "test@gmail.com"] as const;

const DATA_FILE = path.join(process.cwd(), "data", "registered-emails.json");

function readDynamicEmails(): string[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeDynamicEmails(emails: string[]): void {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(emails, null, 2), "utf-8");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function allRegisteredLower(): Set<string> {
  const set = new Set<string>();
  for (const e of STATIC_SEEDS) {
    set.add(normalizeEmail(e));
  }
  for (const e of readDynamicEmails()) {
    set.add(normalizeEmail(e));
  }
  return set;
}

export function isRegisteredEmail(email: string): boolean {
  return allRegisteredLower().has(normalizeEmail(email));
}

export function registerEmail(email: string): void {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return;
  }
  if (allRegisteredLower().has(normalized)) {
    return;
  }
  const next = readDynamicEmails().map(normalizeEmail);
  next.push(normalized);
  writeDynamicEmails(next);
}
