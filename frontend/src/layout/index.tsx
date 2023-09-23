import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Box } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <Box
        bg="#FFF9FB"
        h={"100vh"}
        py={"80px"}
        px={10}
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

export default Layout;
