import React, { useEffect, useRef, useState } from "react";
import "./newPosition.css";
import Draggable from "react-draggable";
import { useStateContext } from "../../context/ContextProvider";
function NewPosition({ id, position, updateXarrow, arrow, isMark, isShort }) {
  const nodeRef = useRef(null);
  const { isClicked, setPositionIdValue, setPositionChildren } =
    useStateContext();
  const [edited, setEdited] = useState(true);
  const [inputValue, setInputValue] = useState("X");

  const handleClick = () => {
    sessionStorage.setItem("POSITION_ID", id);
    if (isClicked?.liaison) {
      const startId = sessionStorage.getItem("start");
      if (startId === "null") {
        sessionStorage.setItem("start", id);
      } else {
        sessionStorage.setItem("end", id);
      }
    }
  };

  const handleDoubleClick = () => {
    if (isClicked?.selection) {
      setEdited(false);
    }
  };
  const handleChange = (e) => {
    setInputValue(e.target.value);
    setPositionIdValue(id, e.target.value);
  };
  let inputStyle = {};

  if (isMark && !isShort) {
    inputStyle = {
      background: "yellow",
      color: "black",
      border: "1px solid black",
    };
  } else if (isShort) {
    inputStyle = {
      background: "red",
      color: "white",
      border: "1px solid white",
    };
  }

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        handle=".handle"
        defaultPosition={{
          x: isNaN(position?.x) ? 0 : position.x,
          y: isNaN(position?.y) ? 0 : position.y,
        }}
        position={null}
        grid={[10, 10]}
        disabled={!isClicked?.selection}
        bounds="parent"
        onDrag={updateXarrow}
        onStop={updateXarrow}
        key={id}
      >
        <div
          ref={nodeRef}
          className="new-position handle"
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          id={id}
          style={
            isMark && !isShort
              ? {
                  background: `yellow`,
                  filter: "drop-shadow(2px 4px 6px  #f7fa60)",
                  border: "2px solid #f7fa60",
                }
              : isMark && isShort
              ? {
                  background: `red`,
                  filter: "drop-shadow(2px 4px 6px rgba(250, 96, 96, 0.88))",
                  border: "2px solid rgb(250, 96, 96)",
                }
              : isShort && {
                  background: `red`,
                  filter: "drop-shadow(2px 4px 6px rgba(250, 96, 96, 0.88))",
                  border: "2px solid rgb(250, 96, 96)",
                }
          }
        >
          <div className="circle-form handle">
            <input
              type="text"
              disabled={edited}
              value={inputValue}
              onChange={handleChange}
              onBlur={() => setEdited(true)}
              style={inputStyle}
            />
          </div>
        </div>
      </Draggable>
    </>
  );
}

export default NewPosition;
