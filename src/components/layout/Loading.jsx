import { FaSpinner } from "react-icons/fa";

import styles from "./Loading.module.css";

const Loading = ({ size, customClass }) => {
  return (
    <div className={`${styles[customClass]}`}>
      <FaSpinner className={styles.spinner} size={size} />
    </div>
  );
};

export default Loading;
