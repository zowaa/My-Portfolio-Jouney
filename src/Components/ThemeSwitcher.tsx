const ThemeSwitcher = ({
  handleSwitch,
  isDark,
}: {
  isDark: boolean;
  handleSwitch: () => void;
}) => {
  return (
    <>
      <button type="button" onClick={handleSwitch}>
        {isDark ? (
          <img
            src="https://img.icons8.com/ios/50/do-not-disturb-2.png"
            alt="dark-mode icon"
          />
        ) : (
          <img
            src="https://img.icons8.com/ios/50/light.png"
            alt="light-mode icon"
          />
        )}
      </button>
    </>
  );
};

export default ThemeSwitcher;
