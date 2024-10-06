import { useState, useEffect } from "react";

const App = () => {
  const [dark, setDark] = useState(() => {
    if (localStorage.getItem("dark-mode"))
      return localStorage.getItem("dark-mode") === "true";
    else return true;
  });

  useEffect(() => {
    if (dark) {
      localStorage.setItem("dark-mode", "true");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("dark-mode", "false");
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setDark((x) => !x);
        }}
      >
        Change
      </button>
      {console.log(dark)}
    </>
  );
};

export default App;
