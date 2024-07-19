import React from "react";
import Modal from "react-modal";
import "./index.css"; // Import the CSS file
import { CrossIconWithBorderGrey } from "../../assets/Icons/CrossIcon";

const Model = ({ modalIsOpen, setModalIsOpen, children, size }) => {
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const styleObject = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      height: size === "lg" ? "75%" : size === "md" ? "45%" : "40%",
      width: size === "lg" ? "70%" : size === "md" ? "45%" : "30%",
      padding: "0",
      borderRadius: "16px",
    },
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={styleObject}
      >
        <div className="header">
          <div className="heading-modal">Delete Cluster</div>
          <button className="cross-icon-btn" onClick={closeModal}>
            <CrossIconWithBorderGrey />
          </button>
        </div>
        <div className="body">
          {children}
          <div className="  justify-content-center">
            <button
              type="button"
              className="btn-secondary btn-size me-4"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="button" className="btn-primary border-0 btn-size">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Model;
