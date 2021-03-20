import React from "react";
import { Spinner } from "reactstrap";

export default function LoadingSpinner({ message = "" }) {
  return (
    <div
      className={
        "py-5 text-center w-100 " +
        (message && "d-flex justify-content-center align-items-center")
      }
    >
      <Spinner color="primary" /> <span className="ml-4">{message}</span>
    </div>
  );
}
