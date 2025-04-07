import styles from "./Title.module.css";

const Title = ({ line1, line2 }) => {
  return (
    <div className={styles.title_wrapper}>
      {line1 && <h3>{line1}</h3>}
      {line2 && <h3>{line2}</h3>}
    </div>
  );
};

export default Title;
