import { isNil } from "lodash";

export const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "medium",
  hour12: false,
});

export function generateId(): string {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    .toString(16)
    .slice(0, 12)
    .padStart(12, "0");
}

export function isNonNil<T>(value: T): value is NonNullable<T> {
  return !isNil(value);
}
