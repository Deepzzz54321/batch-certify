import fetch from "isomorphic-unfetch";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Collapse,
  Form,
  Input,
  Row,
} from "reactstrap";
import { mutate } from "swr";
import InputField from "./InputField";
import ReactCrop, { Crop } from "react-image-crop";
import { driveToDirectImageURL } from "../utils";

const ImageCrop = ({ imageURL, handleFinalise }) => {
  const [font, setFont] = useState(10);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "%" });
  const [completedCrop, setCompletedCrop] = useState<Crop>(null);
  const fontSize = font * 4;
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const handleSubmit = () => {
    if (
      !(
        completedCrop &&
        completedCrop.width &&
        completedCrop.height &&
        fontSize
      )
    ) {
      toast.error("Please select a text region in preview!");
      return false;
    }

    handleFinalise({ crop: completedCrop, fontSize: fontSize });
  };

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    if (crop.width && crop.height) {
      ctx.font = fontSize + "px" + " Helvetica";
      ctx.fillText(
        "Arthur Shelby",
        crop.x * scaleX,
        crop.y * scaleY + fontSize
      );
    }
  }, [completedCrop, font]);

  return (
    <>
      <div className="d-flex">
        <Card className="p-3">
          <h2>Drag a region for the text</h2>
          <ReactCrop
            src={imageURL}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          />
        </Card>
        <Card className="mx-3 p-3">
          <h2>Preview here:</h2>
          <canvas
            ref={previewCanvasRef}
            style={{ width: "100%", height: "auto" }}
          />
        </Card>
      </div>
      <div className="d-flex mt-2">
        <div className="d-flex w-100 align-items-center justify-content-around">
          Font Size:
          <Input
            className="w-75"
            type="range"
            value={font}
            onChange={(e) => setFont(parseInt(e.target.value))}
          />
        </div>
        <Button color="primary" onClick={handleSubmit}>
          Finalise
        </Button>
      </div>
    </>
  );
};

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

export default function CreateTemplateForm() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [cropAttr, setCropAttr] = useState<{ crop: Crop; fontSize: number }>({
    crop: null,
    fontSize: null,
  });
  const { register, handleSubmit, watch, errors } = useForm<Inputs>({
    mode: "onChange",
  });
  const watchImageURL = watch("imageURL");
  const onSubmit = (data) => {
    if (
      !(
        cropAttr &&
        cropAttr.crop &&
        cropAttr.crop.width &&
        cropAttr.crop.height &&
        cropAttr.fontSize
      )
    ) {
      toast.error("Please select a text region in preview!");
      return false;
    }

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
    <div className="mb-4 ">
      <h2 className="mb-3">Create Template</h2>
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-3">
        <InputField
          name="name"
          label="Name"
          type="text"
          error={errors.name}
          formRef={register({ required: "This field is required!" })}
        />
        <Collapse isOpen={!previewOpen}>
          <UploadInstructions />
        </Collapse>
        <div className="d-flex align-items-center">
          <div className="w-100">
            <InputField
              name="imageURL"
              label="Uploaded Image URL"
              type="text"
              error={errors.imageURL}
              formRef={register({
                required: "This field is required!",
                pattern: {
                  value: new RegExp("^https://drive.google.com/file", ""),
                  message: "Only Google Drive Links supported!",
                },
              })}
            />
          </div>
          <div className="mx-2">
            <Button
              color="info"
              type="button"
              disabled={Boolean(
                !watchImageURL || (errors.imageURL && errors.imageURL.message)
              )}
              onClick={() => setPreviewOpen(!previewOpen)}
            >
              Preview
            </Button>
          </div>
        </div>
        <Collapse isOpen={previewOpen}>
          {watchImageURL && !errors.imageURL && (
            <ImageCrop
              imageURL={driveToDirectImageURL(watchImageURL)}
              handleFinalise={(data) => {
                setPreviewOpen(false);
                setCropAttr(data);
              }}
            />
          )}
        </Collapse>
        <div className="text-center">
          <Button color="success" size="lg" className="px-5">
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
}
