import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      position={"fixed"}
      w={"100vw"}
      bottom={0}
      h={"40px"}
      zIndex={9999}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={2}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>© 2023 Creators Studio. All rights reserved</Text>
      </Container>
    </Box>
  );
};

export default Footer;
