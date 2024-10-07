import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "./Translationfiles/{{lng}}.json", // Path to translation files
    },
  });

// Error handling for failed translation loading
i18n.on("failedLoading", (lng, ns, msg) => {
  console.error(`Failed to load ${lng} translations: ${msg}, namespace: ${ns}`);
});

export default i18n;
