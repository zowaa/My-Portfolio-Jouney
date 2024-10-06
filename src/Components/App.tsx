import { useState, useEffect, Dispatch, SetStateAction } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

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

  function handleSwitch() {
    setDark((x: boolean) => !x);
  }

  return (
    <>
      <ThemeSwitcher handleSwitch={handleSwitch} isDark={dark} />
    </>
  );
};

export default App;
