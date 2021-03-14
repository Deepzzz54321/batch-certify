var routes = [
  {
    path: "/templates",
    name: "Templates",
    icon: "image-fill",
    layout: "/admin",
    sideNav: true,
  },
  {
    path: "/templates/new",
    name: "New Template",
    icon: "image-fill",
    layout: "/admin",
  },
  {
    path: "/certificates",
    name: "Certificates",
    icon: "folders-fill",
    layout: "/admin",
    sideNav: true,
  },
  {
    path: "/certificates/new",
    name: "New Certificate Batch",
    icon: "file-add-fill",
    layout: "/admin",
    sideNav: true,
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    layout: "/auth",
  },
];
export default routes;
