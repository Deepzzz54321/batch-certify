import React from "react";

export default function ErrorMessage({ message }) {
  return (
    <div className="py-5 w-100 text-center">
      <div className="d-flex justify-content-center align-items-center">
        <span style={{ fontSize: "4rem", marginRight: "20px" }}>
          <i className="ri-error-warning-fill"></i>
        </span>
        <h3>{message}</h3>
      </div>
    </div>
  );
}
