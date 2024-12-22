import React, { useState } from "react";

interface QuantityProps {
  onQuantityChange: (quantity: number) => void; // 回调函数，处理数量变化
  minQuantity?: number; // 最小数量，默认为 1
  buttonText?: string; // 按钮文本，默认为 "Confirm"
}

const Quantity: React.FC<QuantityProps> = ({
  onQuantityChange,
  minQuantity = 1,
  buttonText = "Confirm",
}) => {
  const [quantity, setQuantity] = useState<number | "">(""); // 初始值為空

  const handleIncrement = () => {
    const newQuantity = (quantity === "" ? minQuantity : quantity) + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(minQuantity, (quantity === "" ? minQuantity : quantity) - 1);
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    if (value === "" || (!isNaN(value) && value >= minQuantity)) {
      setQuantity(value);
      onQuantityChange(value === "" ? 0 : value);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      {/* 數量框 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={quantity === "" ? "< >" : quantity}
          onChange={handleInputChange}
          style={{
            width: "70px",
            textAlign: "center",
            padding: "4px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
          onFocus={() => setQuantity("")} // 聚焦時清空框內的 "< >"
        />
      </div>
      {/* 增加與減少按鈕 */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        <button
          onClick={handleDecrement}
          style={{
            padding: "6px 12px",
            background: "#3182ce",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {"-"}
        </button>
        <button
          onClick={handleIncrement}
          style={{
            padding: "6px 12px",
            background: "#3182ce",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {"+"}
        </button>
      </div>
      {/* 確認按鈕 */}
      <button
        onClick={() => onQuantityChange(quantity === "" ? 0 : quantity)}
        style={{
          padding: "6px 12px",
          background: "#38a169",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "8px",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Quantity;