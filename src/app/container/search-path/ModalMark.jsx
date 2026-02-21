import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useStateContext } from "../../../context/ContextProvider";

function ModalMark({ mark, setIsMarked, isMarked, setEndPath }) {
  const [show, setShow] = useState(mark);
  const { positionIdValue } = useStateContext();
  const [selectedOption, setSelectedOption] = useState({ start: "", end: "" });

  const handleClose = () => {
    setIsMarked({ ...isMarked, showModal: false });
  };

  const handleSubmit = () => {
    if (!isMarked.skip) {
      setIsMarked({
        ...isMarked,
        mark: true,
        showModal: false,
        begin: true,
      });
    } else {
      setIsMarked({ ...isMarked, showModal: false, begin: true });
      setEndPath(true);
    }

    sessionStorage.setItem("startmark", selectedOption.start);
    sessionStorage.setItem("endmark", selectedOption.end);
  };

  return (
    <>
      <Modal show={isMarked.showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Parcours</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Début</Form.Label>
              <Form.Select
                value={selectedOption.start}
                onChange={(e) =>
                  setSelectedOption({
                    ...selectedOption,
                    start: e.target.value,
                  })
                }
              >
                <option value="">Sélectionnez une option</option>
                {positionIdValue.length != 0 &&
                  positionIdValue.map(
                    (val) =>
                      val.id != selectedOption.end && (
                        <option value={val.id} key={val.id}>
                          {val.name}
                        </option>
                      )
                  )}
              </Form.Select>
              <Form.Label>Fin</Form.Label>
              <Form.Select
                value={selectedOption.end}
                onChange={(e) =>
                  setSelectedOption({ ...selectedOption, end: e.target.value })
                }
              >
                <option value="">Sélectionnez une option</option>
                {positionIdValue.length != 0 &&
                  positionIdValue.map(
                    (val) =>
                      val.id != selectedOption.start && (
                        <option value={val.id} key={val.id}>
                          {val.name}
                        </option>
                      )
                  )}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Valider
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalMark;
