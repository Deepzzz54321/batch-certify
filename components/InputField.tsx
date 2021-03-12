import React from "react";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";

export default function InputField({
  name,
  label,
  error,
  id = "",
  type,
  formRef,
  defaultValue = null,
  children = null,
}) {
  const errorMessage = error && error.message;
  return (
    <FormGroup>
      <Label for={name}>{label}</Label>
      <Input
        type={type}
        name={name}
        id={id || name}
        placeholder={`Enter ${label}...`}
        innerRef={formRef}
        invalid={Boolean(errorMessage)}
        defaultValue={defaultValue}
      >
        {children}
      </Input>
      {errorMessage && <FormFeedback>{errorMessage}</FormFeedback>}
    </FormGroup>
  );
}
