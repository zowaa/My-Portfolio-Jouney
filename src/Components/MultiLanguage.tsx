import { useTranslation } from "react-i18next";

const MultiLanguage = () => {
  const { i18n } = useTranslation();

  return (
    <>
      <select
        id="lang"
        value={i18n.language}
        onChange={(e) => {
          i18n.changeLanguage(e.target.value);
          localStorage.setItem("lng", e.target.value);
        }}
      >
        <option value="en">English</option>
        <option value="fr">Francais</option>
        <option value="ar">Arabic</option>
      </select>
    </>
  );
};

export default MultiLanguage;
