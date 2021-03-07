import React from "react";
import { useRouter } from "next/router";
import { Container } from "reactstrap";
import routes from "../../routes";
import AdminNavbar from "../Navbars/AdminNavbar.js";
import Sidebar from "../Sidebar/Sidebar.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const router = useRouter();
  const pathname = router.pathname;

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [pathname]);

  const getBrandText = () => {
    const route = routes.find(
      (route) => pathname === route.layout + route.path
    );
    return route && route.name;
  };

  return (
    <>
      <Sidebar
        {...props}
        logo={{
          innerLink: "/admin/templates",
          imgSrc: "/logo-brand.png",
          imgAlt: "Logo Image",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar {...props} brandText={getBrandText()} />
        <Container className="page-content" fluid>
          {props.children}
        </Container>
      </div>
    </>
  );
};

export default Admin;
