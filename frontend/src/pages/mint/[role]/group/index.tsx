import { NextPageWithLayout } from "../../../_app";
import { ReactElement, useCallback, useState } from "react";
import Layout from "@/layout";
import Registration from "@/components/Registration";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Stack,
  Text,
  useRadioGroup,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import CustomRadio from "@/components/CustomRadio";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { globalStore } from "@/store/global";

const Group: NextPageWithLayout = () => {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const setIsLoading = useSetRecoilState(globalStore.isLoading);
  const isLoading = useRecoilValue(globalStore.isLoading);
  const role = router.query.role;
  const color = role === "teacher" ? "brand.teacher" : "brand.student";

  const toast = useToast();

  const avatars = [
    { name: "group1", image: "🚀" },
    { name: "group2", image: "🍔" },
    { name: "group3", image: "☘️" },
    { name: "group4", image: "🐼" },
    { name: "group5", image: "🔮" },
  ];

  const handleChange = (value: any) => {
    toast({
      title: `The image changed to ${value}!`,
      status: "success",
      duration: 2000,
    });
  };

  const onMint = useCallback(() => {
    setIsLoading(true);
    // mintNFTを呼び出す

    console.log("mintNFT");

    setIsLoading(false);

    router.push("/dashboard");
  }, []);

  const { value, getRadioProps } = useRadioGroup({
    defaultValue: "group1",
    onChange: handleChange,
  });

  const canMint = groupName !== "" && value !== "";

  return (
    <Registration role={"teacher"}>
      <Divider my={5} borderColor={"brand.teacher"} />

      <Text fontWeight={500} fontSize={"xl"} mb={5}>
        Create Group
      </Text>

      <FormControl>
        <FormLabel>Group Name</FormLabel>
        <Input
          placeholder="Group Name"
          size="md"
          onChange={(e) => setGroupName(e.currentTarget.value)}
          value={groupName}
        />

        <FormLabel as="legend" mt={5}>
          Choose image
        </FormLabel>
        <RadioGroup defaultValue="Itachi">
          <Stack spacing="24px" direction={{ md: "row", base: "column" }}>
            {avatars.map((avatar) => {
              return (
                <CustomRadio
                  key={avatar.name}
                  image={avatar.image}
                  {...getRadioProps({ value: avatar.name })}
                  isEmoji={true}
                />
              );
            })}
          </Stack>
        </RadioGroup>

        <Button
          isDisabled={!canMint}
          bg={color}
          color={"white"}
          mt={5}
          w={"full"}
          isLoading={isLoading}
          onClick={onMint}
        >
          Mint NFT
        </Button>
      </FormControl>
    </Registration>
  );
};

Group.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Group;
