import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Link, Route } from "react-router-dom";

import ThemeSwitcher from "./ThemeSwitcher";
import MultiLanguage from "./MultiLanguage";
import Weather from "./Weather";
import Home from "./Home";
import Blog from "./Blog";
import Projects from "./Projects";
import About from "./About";
import Contact from "./Contact";

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
      <nav>
        <ThemeSwitcher handleSwitch={handleThemeSwitch} isDark={dark} />
        <MultiLanguage />
        <Weather />

        <ul>
          <li>
            <Link to="/">{t("home")}</Link>
          </li>
          <li>
            <Link to="/blog">{t("blog")}</Link>
          </li>
          <li>
            <Link to="/projects">{t("projects")}</Link>
          </li>
          <li>
            <Link to="/about">{t("about")}</Link>
          </li>
          <li>
            <Link to="/contact">{t("contact")}</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
};

export default App;
