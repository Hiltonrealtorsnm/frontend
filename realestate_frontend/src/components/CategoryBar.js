// src/components/CategoryBar.js
import React from "react";
import "../styles/components/categoryBar.css";

export default function CategoryBar({ onSelect }) {
  return (
    <div className="category-bar">
      <button onClick={() => onSelect("buy")}>Buy</button>
      <button onClick={() => onSelect("rent")}>Rent</button>
      <button onClick={() => onSelect("sale")}>Sell</button>
    </div>
  );
}
