import React, { useState } from "react";
import "./styles/components/searchBar.css";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const submit = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search city, price, BHK..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-primary" onClick={submit}>
        Search
      </button>
    </div>
  );
}
