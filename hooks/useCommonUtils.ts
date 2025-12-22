export function useCommonUtils() {
  const formatNumericValue = (text: string): string => {
    if (!text) return "";

    let formatted = text.replace(/,/g, ".");

    formatted = formatted.replace(/[^0-9.]/g, "");

    const parts = formatted.split(".");
    if (parts.length > 2) {
      formatted = parts[0] + "." + parts.slice(1).join("");
    }

    if (formatted.startsWith(".")) {
      formatted = "0" + formatted;
    }

    if (
      formatted.length > 1 &&
      formatted.startsWith("0") &&
      formatted[1] !== "."
    ) {
      formatted = formatted.replace(/^0+/, "");
    }
    if (formatted === "" || formatted === ".") {
      return "";
    }

    return formatted;
  };

  /**
   * Formatea un número para mostrar con separadores de miles
   * Usa formato español: punto para miles, coma para decimales
   * Ejemplo: 1234.5 -> "1.234,5" (con decimales)
   * Ejemplo: 1234 -> "1.234" (sin decimales si es entero)
   */
  const formatDisplayNumber = (value: number, decimals?: number): string => {
    // Si no se especifican decimales, detectar automáticamente
    const isInteger = Number.isInteger(value);
    const finalDecimals = decimals !== undefined ? decimals : (isInteger ? 0 : 1);

    return value.toLocaleString("es-ES", {
      minimumFractionDigits: finalDecimals,
      maximumFractionDigits: finalDecimals,
    });
  };

  return {
    formatNumericValue,
    formatDisplayNumber,
  };
}
