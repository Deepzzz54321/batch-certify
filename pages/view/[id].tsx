import React, { useEffect, useRef } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { Certificate } from "../../entities/Certificate";
import { Card } from "reactstrap";
import AuthNavbar from "../../components/Navbars/AuthNavbar";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

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

  const content = router.isFallback ? (
    <LoadingSpinner message="Loading Certificate" />
  ) : certificate ? (
    <>
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
        className="d-flex align-items-center p-4"
        style={{ width: "100%", minHeight: "90vh" }}
      >
        <Card
          className="shadow-lg rounded-lg"
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
  const baseURL = process.env.API_URL || "http://localhost:3000";
  let paths = [];
  try {
    const res = await fetch(`${baseURL}/api/certificates`);
    const data = await res.json();
    paths =
      (data.certificates &&
        data.certificates.map((cert: Certificate) => ({
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
  const baseURL = process.env.API_URL || "http://localhost:3000";
  let certificate = null;
  try {
    const res = await fetch(`${baseURL}/api/certificates/${id}`);
    const data = await res.json();
    certificate = data.certificate;
  } catch (error) {
    console.log(error);
  }
  return {
    props: { certificate },
  };
};
