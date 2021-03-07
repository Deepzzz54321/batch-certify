import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import fetch from "isomorphic-unfetch";
import { toast } from "react-toastify";
import { mutate } from "swr";

const UploadInstructions = () => (
  <>
    <h3>Upload Template Image</h3>
    <Row className="justify-content-center justify-content-md-around mb-3">
      <Col xs="12" md="6" xl="3" className="mt-3">
        <Card className="h-100">
          <CardBody>
            {" "}
            Upload image to{" "}
            <a href="https://drive.google.com/" target="_blank">
              Google Drive
            </a>
            .
          </CardBody>
        </Card>
      </Col>
      <Col xs="12" md="6" xl="3" className="mt-3">
        <Card className="h-100">
          <CardBody>
            {" "}
            Get <b>Shareable Link</b> for the image(
            <a
              href="https://www.youtube.com/watch?v=77CmlRucp-Q"
              target="_blank"
            >
              Watch
            </a>
            ).
          </CardBody>
        </Card>
      </Col>
      <Col xs="12" md="6" xl="3" className="mt-3">
        <Card className="h-100">
          <CardBody>
            {" "}
            Select options <b>Anyone with the Link</b> and <b>Viewer</b>.
          </CardBody>
        </Card>
      </Col>
      <Col xs="12" md="6" xl="3" className="mt-3">
        <Card className="h-100">
          <CardBody>Copy Link and paste below.</CardBody>
        </Card>
      </Col>
    </Row>
  </>
);

type Inputs = {
  name: string;
  imageURL: string;
};

const InputField = ({ name, label, error, id = "", type, formRef }) => {
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
      />
      {errorMessage && <FormFeedback>{errorMessage}</FormFeedback>}
    </FormGroup>
  );
};

export default function CreateTemplateForm() {
  const { register, handleSubmit, watch, errors } = useForm<Inputs>();
  const onSubmit = (data) => {
    fetch("/api/templates", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((data) => {
        console.log(data);
        toast.success(`Created Template: ${data.template.name}`);
        mutate("/api/templates");
      })
      .catch((error) =>
        error.json().then((err) => {
          console.log(err);
          toast.error(err.error);
        })
      );
  };

  return (
    <div className="mb-4 border-bottom border-info">
      <h2 className="mb-3">Create Template</h2>
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-3">
        <InputField
          name="name"
          label="Name"
          type="text"
          error={errors.name}
          formRef={register({ required: "This field is required!" })}
        />
        <UploadInstructions />
        <InputField
          name="imageURL"
          label="Uploaded Image URL"
          type="text"
          error={errors.imageURL}
          formRef={register({
            required: "This field is required!",
            pattern: {
              value: new RegExp("^https://drive.google.com/file", ""),
              message: "Only Google Drive Links supported!", // JS only: <p>error message</p> TS only support string
            },
          })}
        />
        <div className="text-right">
          <Button color="success">Create</Button>
        </div>
      </Form>
    </div>
  );
}
