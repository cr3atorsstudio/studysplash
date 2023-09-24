import DashboardLayout from "@/layout/dashboard";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import Youtube from "react-youtube";
import { Center } from "@chakra-ui/react";

const Study: NextPageWithLayout = () => {
  return (
    <Center mt={10}>
      <Youtube
        videoId="i65pAUGhXhs"
        opts={{
          height: "600px",
          width: "900px",
          playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            start: 597,
          },
        }}
      />
    </Center>
  );
};

Study.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Study;
