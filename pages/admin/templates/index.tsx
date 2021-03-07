import Link from "next/link";
import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import useSWR from "swr";
import ErrorMessage from "../../../components/ErrorMessage";
import LoadingSpinner from "../../../components/LoadingSpinner";
import fetch from "../../../utils/fetch";

const TemplateCard = ({ template }) => (
  <Col className="mb-3">
    <Card style={{ width: "100%" }} className="shadow">
      <CardImg
        alt={template.name}
        src={template.imageURL}
        top
        style={{ width: "auto", height: "160px" }}
      ></CardImg>
      <CardBody>
        <CardTitle className="text-capitalize">{template.name}</CardTitle>
        <Link href="/admin/certificates">
          <Button color="primary" href="/admin/certificates">
            Create Certificates
          </Button>
        </Link>
      </CardBody>
    </Card>
  </Col>
);

const Dashboard = () => {
  const { data, error } = useSWR("/api/templates", fetch);
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Templates</h1>
        <Link href="/admin/templates/new">
          <a href="/admin/templates/new" className="btn btn-primary">
            New Template
          </a>
        </Link>
      </div>
      {!data && !error && <LoadingSpinner />}
      {error && <ErrorMessage message="Failed to load Templates" />}
      {!error && data && (
        <Row xs="1" md="2" lg="3" xl="4">
          {data.templates.map((template) => (
            <TemplateCard template={template} />
          ))}
        </Row>
      )}
    </>
  );
};

export default Dashboard;
