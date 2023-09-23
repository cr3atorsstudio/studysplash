import DashboardLayout from "@/layout/dashboard";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";

const Group: NextPageWithLayout = () => {
  return <>Group!</>;
};

Group.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Group;
