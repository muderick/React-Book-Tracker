import React from "react";
import TopBar from "./TopBar";

const HeaderComponent = ({theme, toggleTheme}) => {
  const styles = {
    width: "100%",
    display: "flex",
    gap: "20px",
  };
  return (
    <>
      <TopBar styles={styles} theme={theme} toggleTheme={toggleTheme}/>
    </>
  );
};

export default HeaderComponent;
