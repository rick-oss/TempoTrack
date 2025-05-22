import { useState } from "react";
import { FaX } from "react-icons/fa6";

import SearchBar from "../layout/SearchBar";

import styles from "./PermissionDeniedPage.module.css";

function LocationDeniedPage({ onLocationSelect }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className={styles.wrapper}>
      <h1>TempoTrack</h1>
      {isVisible && (
        <div className={styles.permission_msg}>
          <p>Não foi possível acessar sua localização. Mas relaxa é só digitar sua cidade aí embaixo</p>
          <button onClick={handleClose}>
            <FaX className={styles.icon_button} />
          </button>
        </div>
      )}
      <SearchBar onLocationSelect={onLocationSelect} customClass="denied-permission" />
    </div>
  );
}

export default LocationDeniedPage;
