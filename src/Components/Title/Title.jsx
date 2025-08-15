import React from "react";
import styles from "./Title.module.css";

const Title = ({title, title2}) => {
  return (
    <>
      <h1 className={styles.title}>
        {title}
        <span className={styles.title2}> {title2}</span>
      </h1>
    </>
  );
};

export default Title;
