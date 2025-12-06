import React from "react";
import PropertyCard from "../components/PropertyCard";
import "../styles/pages/rentProperties.css";

export default function RentProperties() {

  const rentList = [
    {
      id: 1,
      title: "2BHK Flat",
      type: "rent",
      price: "18,000/month",
      location: "Chennai",
      bedrooms: 2,
      bathrooms: 1,
      image: "/house1.jpg"
    }
  ];

  return (
    <div className="container">
      <h1>Properties for Rent</h1>
      <div className="grid" style={{ marginTop: 14 }}>
        {rentList.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
