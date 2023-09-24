import DashboardLayout from "@/layout/dashboard";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";

const Study: NextPageWithLayout = () => {
  return <>video</>;
};

Study.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Study;
