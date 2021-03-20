import React from "react";
import Link from "next/link";
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const AuthNavbar = () => {
  return (
    <>
      <Navbar
        className="navbar-top navbar-horizontal navbar-dark bg-gradient-info py-2 shadow"
        expand="md"
      >
        <Container fluid>
          <Link href="/">
            <div>
              <a href="/">
                <img
                  alt="Logo"
                  src="/logo-brand.png"
                  style={{ height: "2.5rem" }}
                />
              </a>
              <span
                className="d-block text-right text-dark"
                style={{ marginTop: "-10px" }}
              >
                <a
                  href="https://www.linkedin.com/in/eswar-clynn"
                  className="text-dark"
                >
                  By Eswar Clynn
                </a>
              </span>
            </div>
          </Link>
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link href="/">
                    <img alt="..." src="/logo-brand.png" />
                  </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button className="navbar-toggler" id="navbar-collapse-main">
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link href="/">
                  <NavLink className="nav-link-icon" to="/">
                    <i className="ni ni-planet" />
                    <span className="nav-link-inner--text">Dashboard</span>
                  </NavLink>
                </Link>
              </NavItem>
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AuthNavbar;
