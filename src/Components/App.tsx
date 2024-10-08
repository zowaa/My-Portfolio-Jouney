import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

import ThemeSwitcher from "./ThemeSwitcher";
import MultiLanguage from "./MultiLanguage";
import Weather from "./Weather";

const useDarkModeHook = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [darkMode, setDarkMode] = useState(() => {
    if (localStorage.getItem("dark-mode"))
      return localStorage.getItem("dark-mode") === "true";
    else return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("dark-mode", darkMode.toString());
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

const App = () => {
  const [dark, setDark] = useDarkModeHook();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const changeLanguage = async () => {
      const lng = localStorage.getItem("lng");
      if (lng) {
        await i18n.changeLanguage(lng);
      } else {
        localStorage.setItem("lng", i18n.language);
      }
    };

    changeLanguage();
  }, [i18n]);

  function handleThemeSwitch() {
    setDark((x: boolean) => !x);
  }

  return (
    <>
      <ThemeSwitcher handleSwitch={handleThemeSwitch} isDark={dark} />
      <MultiLanguage />
      <Weather />

      <p>{t("welcome")}</p>
    </>
  );
};

export default App;
