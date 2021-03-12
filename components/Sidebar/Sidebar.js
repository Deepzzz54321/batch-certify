import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  Col,
  Collapse,
  Container,
  Media,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import routes from "../../routes";
import Icon from "../Icon";

const navRoutes = routes.filter((route) => route.sideNav);

function Sidebar(props) {
  const router = useRouter();
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const activeRoute = (routeName) => {
    return router.pathname == routeName;
  };
  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };
  const closeCollapse = () => {
    setCollapseOpen(false);
  };
  const { logo } = props;

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo && logo.innerLink && (
          <Link href={logo.innerLink}>
            <span>
              <NavbarBrand href={logo.innerLink} className="pt-0">
                <img
                  alt={logo.imgAlt}
                  className="navbar-brand-img"
                  src={logo.imgSrc}
                />
              </NavbarBrand>
            </span>
          </Link>
        )}
        {/* User */}
        <Media className="align-items-center d-md-none">
          <span className="avatar avatar-sm rounded-circle">
            <img alt="..." src="" />
          </span>
        </Media>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink && (
                    <Link href={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>

          {/* Navigation */}
          <Nav navbar>
            {navRoutes.map((prop, key) => (
              <NavItem key={key} active={activeRoute(prop.layout + prop.path)}>
                <Link href={prop.layout + prop.path}>
                  <NavLink
                    href={prop.layout + prop.path}
                    active={activeRoute(prop.layout + prop.path)}
                    onClick={closeCollapse}
                  >
                    <Icon name={prop.icon} />
                    {prop.name}
                  </NavLink>
                </Link>
              </NavItem>
            ))}
          </Nav>
          {/* Divider */}
          <hr className="my-3" />

          <Nav className="mb-md-3" navbar>
            <NavItem className="active-pro active text-center">
              <NavLink href="https://www.linkedin.com/in/eswar-clynn">
                Eswar Clynn
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Sidebar;
