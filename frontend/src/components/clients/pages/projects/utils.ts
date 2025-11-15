export function resolveClientLocale(language: string): string {
  const base = language.split("-")[0];

  switch (base) {
    case "pt":
      return "pt-PT";
    case "es":
      return "es-ES";
    case "fr":
      return "fr-FR";
    default:
      return "en-US";
  }
}


