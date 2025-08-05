const ReusableButton = ({ title, cssStyles, classes = [], onClick }) => {
  const className = Array.isArray(classes) ? classes.join(" ") : classes;
  return (
    <>
      <button style={cssStyles} className={className} onClick={onClick}>
        {title}
      </button>
    </>
  );
};

export default ReusableButton;
