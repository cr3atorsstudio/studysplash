import { Flex, Text } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  role: string;
}

const Registration = ({ children, role }: Props) => {
  const color = role === "teacher" ? "brand.teacher" : "brand.student";

  return (
    <Flex justify={"center"} align={"center"} mt={10}>
      <Flex
        flexDir={"column"}
        justify={"center"}
        w={{ md: "500px" }}
        bg={"white"}
        py={5}
        px={10}
        rounded={"32px"}
      >
        <Text my={2} textAlign={"center"} fontSize={"4xl"} fontWeight={500}>
          You are registering as...
        </Text>
        <Text
          textTransform={"capitalize"}
          textAlign={"center"}
          mb={5}
          fontWeight={500}
          fontSize={"5xl"}
          color={color}
        >
          {role}
        </Text>

        <Flex flexDir={"column"} alignItems={"center"} mb={5} mt={5}>
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Registration;
