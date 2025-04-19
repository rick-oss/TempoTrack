import styles from "./Container.module.css";

const Container = ({ children, customClass }) => {
  return <div className={`${styles.wrapper} ${styles[customClass]}`}>{children}</div>;
};

export default Container;
