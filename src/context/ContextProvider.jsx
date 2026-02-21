import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
const StateContext = createContext({
  isClicked: null,
  setIsClicked: () => {},
  positionChildren: null,
  setPositionChildren: () => {},
  positionIdValue: null,
  setPositionIdValue: () => {},
  deleteAll: () => {},
  deleteIdValue: () => {},
});

export const ContextProvider = ({ children }) => {
  const [positionChildren, _setPositionChildren] = useState([]);
  const [positionIdValue, _setPositionIdValue] = useState([]);
  const [isClicked, _setIsClicked] = useState({
    selection: true,
    position: false,
    supprimer: false,
  });

  const setIsClicked = (text) =>
    _setIsClicked({
      selection: text === "selection",
      position: text === "position",
      supprimer: text === "supprimer",
      liaison: text === "liaison",
    });

  const setPositionIdValue = (id, value, mark = false) => {
    if (positionIdValue.find((child) => child.id === id)) {
      _setPositionIdValue((prevState) =>
        prevState.map((val) =>
          val?.id === id ? { ...val, name: value, mark: mark } : val
        )
      );
    } else {
      _setPositionIdValue([...positionIdValue, { id: id, name: value }]);
    }
  };

  const deleteIdValue = (id) => {
    _setPositionIdValue(positionIdValue.filter((child) => child.id !== id));
  };

  const deleteAll = () => {
    _setPositionIdValue(positionIdValue.filter((child) => child.name === 0));
  };

  const setPositionChildren = (Component) => {
    if (Array.isArray(Component)) {
      _setPositionChildren(Component);
    } else {
      _setPositionChildren([
        ...positionChildren,
        {
          key: uuidv4(),
          id: uuidv4(),
          component: Component,
          position: {
            x: 50,
            y: 50,
          },
        },
      ]);
    }
  };

  return (
    <StateContext.Provider
      value={{
        isClicked,
        setIsClicked,
        positionChildren,
        setPositionChildren,
        positionIdValue,
        setPositionIdValue,
        deleteAll,
        deleteIdValue,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
export const useStateContext = () => useContext(StateContext);
