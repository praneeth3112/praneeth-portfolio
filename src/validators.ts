const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const CONTROL_CHARS_RE = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g;

export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const EMAIL_MAX = 254;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;

export class ValidationError extends Error {
  errors: Record<string, string>;

  constructor(errors: Record<string, string>) {
    super(
      Object.entries(errors)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; "),
    );
    this.name = "ValidationError";
    this.errors = errors;
  }
}

export function cleanText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).replace(CONTROL_CHARS_RE, "").trim();
}

export interface ValidatedContact {
  name: string;
  email: string;
  message: string;
}

export function validateContact(payload: unknown): ValidatedContact {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new ValidationError({ form: "Expected a JSON object." });
  }

  const record = payload as Record<string, unknown>;

  if (cleanText(record.website)) {
    throw new ValidationError({ form: "Submission rejected." });
  }

  const name = cleanText(record.name);
  const email = cleanText(record.email).toLowerCase();
  const message = cleanText(record.message);
  const errors: Record<string, string> = {};

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.name = `Name must be ${NAME_MIN}-${NAME_MAX} characters.`;
  }
  if (email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    errors.message = `Message must be ${MESSAGE_MIN}-${MESSAGE_MAX} characters.`;
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  return { name, email, message };
}
