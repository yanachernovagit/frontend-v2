export const createSupportCode = (value?: string | null): string | null => {
  if (!value) return null;

  const normalized = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (!normalized) return null;

  return `OA-${normalized.slice(-10)}`;
};

export const appendSupportCode = (
  message: string,
  supportCode?: string | null,
): string => {
  if (!supportCode || message.includes("Código de soporte:")) {
    return message;
  }

  return `${message}\nCódigo de soporte: ${supportCode}`;
};
