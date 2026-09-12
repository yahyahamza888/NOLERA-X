export type NoleraLanguage = "en" | "ar"

const LANGUAGE_KEY = "nolera_x_language"

export function getNoleraLanguage(): NoleraLanguage {
  if (typeof window === "undefined") return "en"

  const saved = window.localStorage.getItem(LANGUAGE_KEY)

  return saved === "ar" ? "ar" : "en"
}

export function setNoleraLanguage(language: NoleraLanguage) {
  if (typeof window === "undefined") return

  window.localStorage.setItem(LANGUAGE_KEY, language)
  window.dispatchEvent(new Event("nolera-language-change"))
}

export function isArabic() {
  return getNoleraLanguage() === "ar"
}
