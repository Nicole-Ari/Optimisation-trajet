import React, { useEffect, useRef, useState } from "react";
import "./searchPath.css";
import {
  ArrowUpLeftIcon,
  Circle,
  Edit2,
  Edit3,
  Eraser,
  ReplaceIcon,
} from "lucide-react";
import Outils from "../../components/Outils";
import NewPosition from "../../components/NewPosition";
import { Xwrapper } from "react-xarrows";
import { useStateContext } from "../../../context/ContextProvider";
import Xarrow, { useXarrow } from "react-xarrows";
import { Button } from "react-bootstrap";
import ModalMark from "./ModalMark";
import { marquer, makeShortPath, makeMinPath } from "../../../mark-min/mark";

function SearchPath() {
  const {
    isClicked,
    setIsClicked,
    positionChildren,
    setPositionChildren,
    positionIdValue,
    deleteAll,
    deleteIdValue,
  } = useStateContext();
  const updateXarrow = useXarrow();
  const [arrows, setArrows] = useState([]);
  const [shortPath, setShortPath] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [next, setNext] = useState(0);
  const [isMarked, setIsMarked] = useState({
    begin: false,
    mark: false,
    showModal: false,
    skip: false,
  });
  const [showEdit, setShowEdit] = useState({});
  const [allMarked, setAllMarked] = useState(false);
  const [reinit, setReinit] = useState(false);
  const [endPath, setEndPath] = useState(false);
  const [clicked, setClicked] = useState(false);
  // const [shortPathIds,setShortPathIds] = use
  const [ids, setIds] = useState([]);

  const reset = () => {
    sessionStorage.setItem("start", null);
    sessionStorage.setItem("end", null);
  };

  const supprimer = () => {
    reset();
    const id = sessionStorage.getItem("POSITION_ID");
    setPositionChildren(positionChildren.filter((child) => child.id !== id));
    setArrows(arrows.filter((arrow) => arrow.start !== id && arrow.end !== id));
    deleteIdValue(id);
  };

  const makeLink = () => {
    const end = sessionStorage.getItem("end");
    const start = sessionStorage.getItem("start");
    if (start && end && start !== "null" && end !== "null") {
      setArrows([
        ...arrows,
        {
          start: start,
          end: end,
          name: start + "/" + end,
          value: 0,
          edited: false,
        },
      ]);
      reset();
    }
  };

  const doAction = (param) => {
    updateXarrow();
    if (param.position && !isMarked.begin) {
      reset();
      setPositionChildren(NewPosition);
    } else if (param.supprimer) {
      supprimer();
    } else if (isClicked.liaison && !isMarked.begin) {
      makeLink();
    }
  };

  const handleClick = (indexToRemove) => {
    if (isClicked.liaison) {
      setArrows(arrows.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleDoubleClick = (param) => {
    if (isClicked?.liaison) {
      setArrows((prevState) =>
        prevState.map((val) =>
          val?.name === param ? { ...val, edited: true } : val
        )
      );
    }
  };

  const makeDisable = (param) => {
    if (isClicked?.liaison) {
      setArrows((prevState) =>
        prevState.map((val) =>
          val?.name === param ? { ...val, edited: false } : val
        )
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArrows((prevState) =>
      prevState.map((val) =>
        val?.name === name ? { ...val, value: value } : val
      )
    );
  };

  const startMark = () => {
    setNext(next + 1);
    if (isMarked.mark) {
      const selectedOption = {
        start: sessionStorage.getItem("startmark"),
        end: sessionStorage.getItem("endmark"),
      };

      marquer(
        selectedOption,
        positionIdValue,
        arrows,
        setPositionChildren,
        setArrows,
        positionChildren
      );
    }
  };

  const startMakeShortPath = () => {
    const start = sessionStorage.getItem("startmark");
    const end = sessionStorage.getItem("endmark");
    const finalPath = [
      ...makeShortPath(
        end,
        start,
        setPositionChildren,
        positionChildren,
        setTotalValue,
        arrows
      ),
    ];
    setShortPath(finalPath);
  };

  const minPath = () => {
    const start = sessionStorage.getItem("startmark");
    const end = sessionStorage.getItem("endmark");
    const selectedOption = {
      start: sessionStorage.getItem("startmark"),
      end: sessionStorage.getItem("endmark"),
    };

    makeMinPath(
      selectedOption,
      positionIdValue,
      arrows,
      setPositionChildren,
      setArrows,
      positionChildren
    );

    startMakeShortPath();
    setEndPath(true);
  };
  const showEditButton = (param) => {
    if (isClicked.liaison) {
      setShowEdit({ id: param, show: true });
    }
  };

  const hideEditButton = (param) => {
    if (isClicked.liaison && showEdit.id === param) {
      setTimeout(() => {
        setShowEdit((prev) => {
          if (prev.id === param) {
            return { id: param, show: false };
          }
          return prev;
        });
      }, 100);
    }
  };

  const reinitialiser = () => {
    setReinit(true);
    setPositionChildren(positionChildren.filter((child) => child.id === null));
    deleteAll();
    setArrows([]);
    setIsMarked({ ...isMarked, mark: false, begin: false, skip: false });
    setTotalValue(0);
    setEndPath(false);
    setClicked(false);
    setShortPath([]);
  };

  useEffect(() => {
    startMark();
  }, [isMarked.mark]);

  useEffect(() => {
    makeShortPath();

    const allAreMarked =
      positionChildren.length > 0 &&
      positionChildren.every((item) => item.mark === true);
    setAllMarked(allAreMarked);
  }, [positionChildren]);
  useEffect(() => {
    setIds([...positionIdValue]);
  }, [arrows]);

  return (
    <div className="search-path ">
      <div className="container-search">
        <div
          className={`${
            isClicked.selection
              ? "selection "
              : isClicked.supprimer
              ? "supprimer "
              : isClicked.liaison
              ? "liaison "
              : isClicked.position
              ? "position "
              : ""
          }`}
          onClick={() => doAction(isClicked)}
          style={{ height: "92%", width: "100%" }}
        >
          {" "}
          <Xwrapper>
            {positionChildren.map((child) => {
              const Component = child?.component;

              return (
                <Component
                  key={child.key}
                  id={child?.id}
                  position={child?.position}
                  updateXarrow={updateXarrow}
                  isMark={child?.mark ? child?.mark : false}
                  isShort={child.short ? child.short : false}
                />
              );
            })}

            {arrows.map((arrow, index) => (
              <Xarrow
                key={index}
                start={arrow.start}
                end={arrow.end}
                color="#60a5fa"
                strokeWidth={2}
                labels={{
                  middle: (
                    <div className="label">
                      <div
                        className="top-input"
                        onMouseEnter={() =>
                          showEditButton(arrow.start + "/" + arrow.end)
                        }
                        onMouseLeave={() =>
                          hideEditButton(arrow.start + "/" + arrow.end)
                        }
                      >
                        <Edit2
                          style={{
                            visibility:
                              showEdit.id == arrow.start + "/" + arrow.end &&
                              showEdit.show
                                ? "visible"
                                : "hidden",
                          }}
                          className="edit-icon"
                          title="Double-cliquez pour modifier "
                          onClick={() =>
                            handleDoubleClick(arrow.start + "/" + arrow.end)
                          }
                        />
                        <input
                          type="number"
                          value={arrow.value}
                          name={arrow.start + "/" + arrow.end}
                          disabled={!arrow.edited}
                          onChange={handleChange}
                          onBlur={() =>
                            makeDisable(arrow.start + "/" + arrow.end)
                          }
                        />
                      </div>

                      <p onClick={() => handleClick(index)}>x</p>
                    </div>
                  ),
                }}
                labelsStyle={{
                  color: "black",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
                curveness={0.1}
                dashness={{ strokeLen: 10, nonStrokeLen: 5, animation: true }}
              />
            ))}
          </Xwrapper>
        </div>

        <div className="container-foot">
          <Button variant={"danger"} onClick={reinitialiser}>
            Réinitialiser
          </Button>
          <div className="footer text-black">
            {isMarked.showModal && (
              <ModalMark
                mark={isMarked.showModal}
                arrows={arrows}
                setIsMarked={setIsMarked}
                isMarked={isMarked}
                ids={ids}
                setEndPath={setEndPath}
              />
            )}
            {isMarked.mark ? (
              !allMarked ? (
                <Button onClick={startMark}>Etape suivante</Button>
              ) : (
                <Button
                  onClick={() => {
                    startMakeShortPath();
                    setClicked(true);
                  }}
                  disabled={clicked}
                >
                  Chemin minimal
                </Button>
              )
            ) : (
              <>
                <Button
                  disabled={arrows.length === 0 || endPath}
                  onClick={() => setIsMarked({ ...isMarked, showModal: true })}
                >
                  Commencer à marquer
                </Button>
              </>
            )}

            {!endPath ? (
              <Button
                onClick={() =>
                  setIsMarked({
                    ...isMarked,
                    showModal: true,
                    skip: true,
                  })
                }
                disabled={arrows.length === 0 ? true : isMarked.mark}
              >
                Trajet optimal
              </Button>
            ) : (
              <Button
                onClick={
                  !isMarked.skip
                    ? () => {
                        setIsMarked({
                          ...isMarked,
                          showModal: true,
                          skip: true,
                        });
                      }
                    : () => {
                        minPath();
                        setClicked(true);
                      }
                }
                disabled={clicked}
              >
                Chemin minimal
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="outil">
        <div className="title">
          <h5>Outils</h5>
        </div>
        <div className="container-outil">
          <Outils
            Icon={ArrowUpLeftIcon}
            text={"Selection"}
            isClicked={isClicked?.selection}
            handleClick={() => setIsClicked("selection")}
          />
          <Outils
            Icon={Circle}
            text={"Position"}
            isClicked={isClicked?.position}
            handleClick={() => setIsClicked("position")}
            disabled={allMarked}
          />
          <Outils
            Icon={ReplaceIcon}
            text={"Liaison"}
            isClicked={isClicked?.liaison}
            handleClick={() => setIsClicked("liaison")}
            disabled={allMarked}
          />
          <Outils
            Icon={Eraser}
            text={"Supprimer"}
            isClicked={isClicked?.supprimer}
            handleClick={() => setIsClicked("supprimer")}
          />

          <hr />
        </div>
        <div className="details">
          <div className="title">
            <h5>Details</h5>
          </div>
          <div className="details-container" style={{ color: "black" }}>
            <p className="chemin-val-libel">
              Total chemin minimal:{" "}
              <span className="chemin-min-val">{totalValue}</span>
            </p>
            <div className="chemin-min">
              {allMarked &&
                shortPath.map((val) => (
                  <>
                    <span className="val-X">
                      {ids.find((item) => item.id == val.x)?.name}
                    </span>
                    {shortPath[shortPath.length - 1].x !== val.x && (
                      <span className="fleche">→</span>
                    )}
                  </>
                ))}
            </div>

            <div className="chemin-min-noeud">
              {allMarked &&
                shortPath.map((val) => (
                  <div className="chemin-min-val-x">
                    <p className="libelle-x">
                      {ids.find((item) => item.id == val.x)?.name}:
                    </p>{" "}
                    <span className="valeur-x">{val.value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPath;
