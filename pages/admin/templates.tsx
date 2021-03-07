import Link from "next/link";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  Col,
  Collapse,
  Row,
} from "reactstrap";
import useSWR from "swr";
import CreateTemplateForm from "../../components/CreateTemplateForm";
import ErrorMessage from "../../components/ErrorMessage";
import Icon from "../../components/Icon";
import LoadingSpinner from "../../components/LoadingSpinner";
import fetch from "../../utils/fetch";

const TemplateCard = ({ template }) => (
  <Col className="mb-3">
    <Card style={{ width: "100%" }}>
      <CardImg
        alt={template.name}
        src={template.imageURL}
        top
        style={{ width: "auto", height: "160px" }}
      ></CardImg>
      <CardBody>
        <CardTitle className="text-capitalize">{template.name}</CardTitle>
        <Link href={"/admin/certificates/new?id=" + template.id}>
          <Button
            color="primary"
            href={"/admin/certificates/new?id=" + template.id}
          >
            Create Certificates
          </Button>
        </Link>
      </CardBody>
    </Card>
  </Col>
);

const Dashboard = () => {
  const { data, error } = useSWR("/api/templates", fetch);
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Templates</h1>
        <Button
          color="primary"
          className="d-flex align-items-center"
          onClick={() => setCreateOpen(!createOpen)}
        >
          New Template
          <Icon
            name={`arrow-${createOpen ? "up" : "down"}-s-line`}
            style={{ fontSize: "1rem" }}
          />
        </Button>
      </div>
      <Collapse isOpen={createOpen}>
        <CreateTemplateForm />
      </Collapse>
      {!data && !error && <LoadingSpinner />}
      {error && <ErrorMessage message="Failed to load Templates" />}
      {!error && data && (
        <Row xs="1" md="2" lg="3" xl="4">
          {data.templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </Row>
      )}
    </>
  );
};

export default Dashboard;
