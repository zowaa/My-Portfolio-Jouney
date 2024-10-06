const App = () => {
  return (
    <>
      <button
        type="button"
        onClick={() => {
          document.documentElement.classList.toggle("dark");
        }}
      >
        Click
      </button>
    </>
  );
};

export default App;
