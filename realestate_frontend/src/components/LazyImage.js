import React, { useState } from "react";

export default function LazyImage({ src, alt, className, style }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="lazy-wrapper"
      style={{
        position: "relative",
        overflow: "hidden",
        ...style
      }}
    >
      {/* BLUR PLACEHOLDER */}
      <div
        className="lazy-blur"
        style={{
          position: "absolute",
          inset: 0,
          background: "#e5e7eb",
          filter: "blur(20px)",
          transition: "opacity 0.4s ease",
          opacity: loaded ? 0 : 1
        }}
      />

      {/* REAL IMAGE */}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "opacity 0.5s ease",
          opacity: loaded ? 1 : 0,
        }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
