import App from "./App";

const routes = [
  {
    path: "/:page?/:id?", // `?` makes `/` also match as default
    element: <App />,
  },
];

export default routes;
