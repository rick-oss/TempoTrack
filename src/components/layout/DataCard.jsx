import styles from "./DataCard.module.css";

function DataCard({ dataName, dataIcon, dataValue, iconColor }) {
  return (
    <figure className={styles.card_wrapper}>
      <p>{dataValue || "nada"}</p>
      <i style={{color: `${iconColor}`}}>{dataIcon}</i>
      <figcaption>{dataName}</figcaption>
    </figure>
  );
}

export default DataCard;
