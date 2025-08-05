import Survey from "@/pages/Survey";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/s/go/:shareID",
    element: <Survey /> /*errorElement: <ErrorPage /> */,
  },
]);

export default router;
