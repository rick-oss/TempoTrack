import { FaSpinner } from "react-icons/fa";

import styles from "./Loading.module.css";

const Loading = ({ size }) => {
  return (
    <>
      <FaSpinner className={styles.spinner} size={size} />
    </>
  );
};

export default Loading;
