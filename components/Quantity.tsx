import React, { useState } from "react";
import styles from "./Quantity.module.scss";

interface QuantityProps {
  onQuantityChange: (quantity: number) => void;
  onClaim?: () => void; // 添加 onClaim 回调
  minQuantity?: number;
  buttonText?: string;
  className?: string;
  style?: React.CSSProperties; // 新增 style 属性
}

const Quantity: React.FC<QuantityProps> = ({
  onQuantityChange,
  onClaim, // 接收 onClaim 回调
  minQuantity = 1,
  buttonText = "Confirm",
  className,
  style, // 接收 style 属性
}) => {
  const [quantity, setQuantity] = useState<number>(minQuantity);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(minQuantity, quantity - 1);
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue)) {
        setQuantity(Math.max(minQuantity, numericValue));
        onQuantityChange(Math.max(minQuantity, numericValue));
      } else {
        setQuantity(minQuantity);
      }
    }
  };

  const handleInputBlur = () => {
    if (quantity < minQuantity) {
      setQuantity(minQuantity);
      onQuantityChange(minQuantity);
    }
  };

  return (
    <div className={`${styles.quantityContainer} ${className}`} style={style}>
      <button
        className={styles.decrementButton}
        onClick={handleDecrement}
        aria-label="Decrement"
        style={{ width: "auto" }} // 按鈕寬度自適應內容
      >
        -
      </button>
      <input
        type="text"
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className={styles.quantityInput}
        aria-label="Quantity input"
      />
      <button
        className={styles.incrementButton}
        onClick={handleIncrement}
        aria-label="Increment"
        style={{ width: "auto" }} // 按鈕寬度自適應內容
      >
        +
      </button>
      <button
        className={styles.confirmButton}
        onClick={() => onQuantityChange(quantity)}
        aria-label="Confirm"
        style={{ width: "auto" }} // 按鈕寬度自適應內容
      >
        {buttonText}
      </button>
      {onClaim && ( // 添加 Claim 按钮
        <button
          className={styles.claimButton}
          onClick={onClaim}
          aria-label="Claim"
          style={{ width: "auto" }} // 按鈕寬度自適應內容
        >
          Claim
        </button>
      )}
    </div>
  );
};

export default Quantity;