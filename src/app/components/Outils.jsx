import React from "react";
import "./outil.css";
function Outils({ Icon, text, iconClass, size, isClicked, handleClick }) {
  return (
    <div
      className={`outil-item ${isClicked ? "clicked" : ""}`}
      onClick={handleClick}
    >
      <div className={`circle-icon ${iconClass ? iconClass : ""}`}>
        <Icon size={size ? size : 17} />
      </div>
      <div className="outil-text">
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Outils;
