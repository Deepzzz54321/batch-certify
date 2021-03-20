import React, { useEffect, useRef } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { Certificate } from "../../entities/Certificate";
import { Button, Card, UncontrolledTooltip } from "reactstrap";
import AuthNavbar from "../../components/Navbars/AuthNavbar";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Icon from "../../components/Icon";
import { toast } from "react-toastify";
import startOrm from "../../utils/initialize-database";

const ViewCertificate: React.FC<{ certificate: Certificate }> = ({
  certificate,
}) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;

    if (image) {
      image.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const pixelRatio = window.devicePixelRatio;

        canvas.width = 1.25 * image.naturalWidth;
        canvas.height = 1.25 * image.naturalHeight;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
        const { crop, scale, fontSize } = certificate.template.imageAttr;
        ctx.font = fontSize + "px" + " Helvetica";
        ctx.fillText(
          certificate.name,
          crop.x * scale.x,
          crop.y * scale.y + fontSize
        );
      };
    }
  }, []);

  const handleCopy = () => {
    const link =
      (process.env.VERCEL_URL || "http://localhost:3000") + router.asPath;

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = link;
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    toast("Shareable Link copied to clipboard!");
  };

  const ExportActions = () => {
    return (
      <>
        <Button id="downloadButton" color="primary" className="p-1">
          <Icon name="download-line" style={{ fontSize: "1.3rem" }} />
        </Button>
        <UncontrolledTooltip placement="top" target="downloadButton">
          <span className="d-md-none">Long hold </span>{" "}
          <span className="d-none d-md-inline">Right click </span> the image and
          click 'Save Image as'.
        </UncontrolledTooltip>
        <Button color="primary" className="p-1" onClick={handleCopy}>
          <Icon name="share-line" style={{ fontSize: "1.3rem" }} />
        </Button>
      </>
    );
  };

  const content = router.isFallback ? (
    <LoadingSpinner message="Loading Certificate" />
  ) : certificate ? (
    <>
      <div
        style={{ position: "absolute", top: "0", right: "0" }}
        className="m-2 d-none d-md-block"
      >
        <ExportActions />
      </div>

      <canvas ref={canvasRef} style={{ width: "100%" }} />
      <img
        src={certificate.template.imageURL}
        ref={imageRef}
        className="d-none"
      />
    </>
  ) : (
    <ErrorMessage message="Certificate not found!" />
  );

  return (
    <>
      <AuthNavbar />
      <div
        className="d-md-flex align-items-center p-4"
        style={{ width: "100%", minHeight: "90vh" }}
      >
        <div className="d-md-none text-center mb-3">
          <ExportActions />
        </div>
        <Card
          className="shadow-lg rounded-lg position-relative"
          style={{ height: "100%", width: "100%" }}
        >
          {content}
        </Card>
      </div>
    </>
  );
};

export default ViewCertificate;

export const getStaticPaths: GetStaticPaths = async () => {
  let paths = [];
  try {
    const orm = await startOrm();
    const certificates = await orm.em.find(Certificate, {}, ["template"]);
    paths =
      (certificates &&
        certificates.map((cert) => ({
          params: { id: cert.id },
        }))) ||
      [];
  } catch (error) {
    console.log(error);
  }

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params;
  let certificate = null;
  try {
    const orm = await startOrm();
    certificate = await orm.em.findOne(Certificate, { id }, ["template"]);
    certificate = JSON.parse(JSON.stringify(certificate));
  } catch (error) {
    console.log(error);
  }
  return {
    props: { certificate },
  };
};
