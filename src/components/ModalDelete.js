import React from "react";
import "./modalDelete.css";

function ModalDelete({ setOpenModal, handlePostDelete}) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="body">
        <p>θέλετε να διαγράψετε αυτήν την ανάρτηση?</p>
        </div>
        <div className="footer">
            <button
                onClick={() => {
                setOpenModal(false);
                handlePostDelete();
                }}
                id="cancelBtn"
            >
                Διαγραφή
            </button>
            
            <button
                onClick={() => {
                setOpenModal(false);
                }}
                // id="cancelBtn"
            >
                Ακύρωση
            </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDelete;