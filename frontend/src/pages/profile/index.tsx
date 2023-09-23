import DashboardLayout from "@/layout/dashboard";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";

const Profile: NextPageWithLayout = () => {
  return <>Profile!</>;
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Profile;
