import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Box } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <Sidebar />
      <Box
        bg="#FFF9FB"
        py={"80px"}
        px={{ md: 20, base: 5 }}
        w={{ md: "calc(100vw - 200px)" }}
        h={"100vh"}
        ml={"auto"}
        overflowY={"scroll"}
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default DashboardLayout;
