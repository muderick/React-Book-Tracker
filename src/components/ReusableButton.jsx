import React from "react";

const ReusableButton = ({ title, cssStyles, classes = [] }) => {
  const className = Array.isArray(classes) ? classes.join(" ") : classes;
  return (
    <>
      <button style={cssStyles} className={className}>
        {title}
      </button>
    </>
  );
};

export default ReusableButton;
