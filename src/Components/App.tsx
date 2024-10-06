import { useState, useEffect, Dispatch, SetStateAction } from "react";

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

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setDark((x: boolean) => !x);
        }}
      >
        Change
      </button>
      {console.log(dark)}
    </>
  );
};

export default App;
