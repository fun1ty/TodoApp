import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Todo from "../src/Todo";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "todo",
        element: <Todo />,
        children: [
          {
            path: ":todoId",
            element: <Todo />,
          },
        ],
      },
    ],
  },
]);

export default Router;
