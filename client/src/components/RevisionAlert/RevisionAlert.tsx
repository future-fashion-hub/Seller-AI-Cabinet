import { Alert } from 'antd';
import React from 'react';
import styles from './RevisionAlert.module.css';

type RevisionAlertProps = {
  missingFields: string[];
};

export const RevisionAlert: React.FC<RevisionAlertProps> = ({ missingFields }) => {
  const items = missingFields.length ? missingFields : ['Характеристики товара'];

  return (
    <Alert
      description={
        <div className={styles.content}>
          <div className={styles.title}>Требуются доработки</div>
          <div className={styles.text}>У объявления не заполнены поля:</div>
          <ul className={styles.list}>
            {items.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      }
      type="warning"
      showIcon
      className={styles.alert}
    />
  );
};
