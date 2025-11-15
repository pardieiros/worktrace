import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { resources } from "./locales/resources";

void i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  supportedLngs: ["en", "es", "fr", "pt"],
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ["querystring", "localStorage", "navigator"],
    caches: ["localStorage"]
  }
});

export default i18n;


