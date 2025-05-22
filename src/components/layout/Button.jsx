import styles from "./Button.module.css";

const Button = ({ onUnitToggle, unit }) => {
  return (
    <button className={styles.toggle_button} onClick={onUnitToggle}>
      Ver em {unit === "metric" ? "°F" : "°C"}
    </button>
  );
};

export default Button;
