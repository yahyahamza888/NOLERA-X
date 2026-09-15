"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  getNoleraLanguage,
  setNoleraLanguage,
  type NoleraLanguage,
} from "@/lib/nolera-language"
import { translations } from "@/lib/translations"

type TranslationKey = keyof typeof translations.ar

type NoleraLanguageContextValue = {
  language: NoleraLanguage
  isArabic: boolean
  setLanguage: (language: NoleraLanguage) => void
  t: (key: TranslationKey) => string
}

const NoleraLanguageContext =
  createContext<NoleraLanguageContextValue | null>(null)

export default function NoleraLanguageProvider({
  children,
}: {
  children: ReactNode
}) {
  const [language, setLanguageState] = useState<NoleraLanguage>("ar")

  useEffect(() => {
    const sync = () => {
      setLanguageState(getNoleraLanguage())
    }

    sync()

    window.addEventListener("nolera-language-change", sync)
    window.addEventListener("storage", sync)

    return () => {
      window.removeEventListener("nolera-language-change", sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  useEffect(() => {
    const isAr = language === "ar"

    document.documentElement.lang = language
    document.documentElement.dir = isAr ? "rtl" : "ltr"
    document.body.dir = isAr ? "rtl" : "ltr"
    document.body.dataset.language = language
  }, [language])

  const changeLanguage = (next: NoleraLanguage) => {
    setLanguageState(next)
    setNoleraLanguage(next)
  }

  const t = (key: TranslationKey) => {
    return translations[language][key] ?? translations.ar[key] ?? key
  }

  const value = useMemo(
    () => ({
      language,
      isArabic: language === "ar",
      setLanguage: changeLanguage,
      t,
    }),
    [language],
  )

  return (
    <NoleraLanguageContext.Provider value={value}>
      {children}
    </NoleraLanguageContext.Provider>
  )
}

export function useNoleraLanguage() {
  const context = useContext(NoleraLanguageContext)

  if (!context) {
    throw new Error(
      "useNoleraLanguage must be used inside NoleraLanguageProvider",
    )
  }

  return context
}
