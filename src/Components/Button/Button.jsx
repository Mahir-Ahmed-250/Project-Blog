import React from "react";
import styles from "./Button.module.css";

const Button = ({title, width, border, color, fontSize, onClick}) => {
  return (
    <>
      <button
        onClick={onClick}
        className={styles.btn}
        style={{
          width: `${width}`,
          border: `${border}`,
          color: `${color}`,
          fontSize: `${fontSize}`,
        }}>
        {title}
      </button>
    </>
  );
};

export default Button;
