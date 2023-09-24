import DashboardLayout from "@/layout/dashboard";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import Youtube from "react-youtube";
import { Center } from "@chakra-ui/react";

const Study: NextPageWithLayout = () => {
  return (
    <Center mt={10}>
      <Youtube videoId="UDQlDF4TWYM" />
    </Center>
  );
};

Study.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Study;
