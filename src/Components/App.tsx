import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import ThemeSwitcher from "./ThemeSwitcher";
import MultiLanguage from "./MultiLanguage";

const useDarkModeHook = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [darkMode, setDarkMode] = useState(() => {
    if (localStorage.getItem("dark-mode"))
      return localStorage.getItem("dark-mode") === "true";
    else return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem("dark-mode", "true");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("dark-mode", "false");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

const App = () => {
  const [dark, setDark] = useDarkModeHook();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const lng = localStorage.getItem("lng");
    if (lng) i18n.changeLanguage(lng);
    else localStorage.setItem("lng", "en");
  }, [i18n]);

  function handleThemeSwitch() {
    setDark((x: boolean) => !x);
  }

  return (
    <>
      <ThemeSwitcher handleSwitch={handleThemeSwitch} isDark={dark} />
      <MultiLanguage />

      <p>{t("welcome")}</p>
    </>
  );
};

export default App;
