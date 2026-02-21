import { createBrowserRouter } from "react-router-dom";
import Parent from "../app/container/parent/Parent";
import Welcome from "../app/components/Welcome";
import SearchPath from "../app/container/search-path/SearchPath";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Parent />,
    children: [
      {
        path: "/",
        element: <Welcome />,
      },
      {
        path: "/search-min-path",
        element: <SearchPath />,
      },
    ],
  },
]);
export default router;
