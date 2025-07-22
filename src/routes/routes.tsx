import Survey from "@/pages/Survey";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/s/go/:surveyID",
    element: <Survey /> /*errorElement: <ErrorPage /> */,
  },
]);

export default router;
