import React from "react";
import { Spinner } from "reactstrap";

export default function LoadingSpinner() {
  return (
    <div className="py-5 text-center w-100">
      <Spinner color="primary" />
    </div>
  );
}
