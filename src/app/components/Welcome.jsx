import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const Navigate = useNavigate();
  const handleClick = () => {
    Navigate("search-min-path");
  };
  return (
    <div className="welcome-part">
      <div className="wlc-item">
        <div className="wlc-first-text">
          <h1 className="welcome">
            Bienvenue sur{" "}
            <span>
              Op<span className="text-white">tiRou</span>te
            </span>
          </h1>
          <p className="description">
            OptiRoute est un outil d'optimisation de trajets qui vous aide à
            trouver le chemin le plus court pour un trajet entre deux
            emplacements.
          </p>
        </div>

        <Button className="btn-start" onClick={handleClick}>
          Commencer
        </Button>
      </div>
    </div>
  );
}

export default Welcome;
