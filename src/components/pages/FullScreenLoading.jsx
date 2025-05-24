import { FaSpinner } from "react-icons/fa";

import styles from "./FullScreenLoading.module.css";

const FullScreenLoading = () => {
  return (
    <div className={styles.full_screen}>
      <FaSpinner className={styles.spinner} size={64} />
    </div>
  );
};

export default FullScreenLoading;
