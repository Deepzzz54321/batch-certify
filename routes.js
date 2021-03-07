var routes = [
  {
    path: "/templates",
    name: "Templates",
    icon: "ni ni-tv-2 text-primary",
    layout: "/admin",
  },
  {
    path: "/certificates",
    name: "Certificates",
    icon: "ni ni-planet text-blue",
    layout: "/admin",
  },
  {
    path: "/templates/new",
    name: "New Template",
    layout: "/admin",
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
