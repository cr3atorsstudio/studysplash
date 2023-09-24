import { NextPageWithLayout } from "../../../_app";
import { ReactElement, use, useCallback, useEffect, useState } from "react";
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
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ERC6551_ABI } from "@/config/erc1155ABI";

const Group: NextPageWithLayout = () => {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [nextTokenId, setNextTokenId] = useState(0);
  const [contractConfig, setContractConfig] = useState();
  const setIsLoading = useSetRecoilState(globalStore.isLoading);
  const isLoading = useRecoilValue(globalStore.isLoading);
  const role = router.query.role;
  const color = role === "teacher" ? "brand.teacher" : "brand.student";

  const toast = useToast();

  const avatars = [
    { name: "1", image: "🚀" },
    { name: "2", image: "🍔" },
    { name: "3", image: "☘️" },
    { name: "4", image: "🐼" },
    { name: "5", image: "🔮" },
  ];

  const handleChange = (value: any) => {
    setImageUrl(
      `https://studysplash.s3.us-east-1.amazonaws.com/assets/emoji/${value}.svg`
    );
    toast({
      title: `The image changed to ${value}!`,
      status: "success",
      duration: 2000,
    });
  };

  const { address, isConnected } = useAccount();

  const { config, error } = usePrepareContractWrite({
    address: "0x8e8233c85ef160859349dd3da61a9f58fa9d07ef",
    abi: ERC6551_ABI,
    functionName: "mint",
    chainId: 137,
    args: [address, nextTokenId],
  });
  console.log("error", error);
  //@ts-ignore
  const {
    data: writeData,
    isError: isWriteError,
    isLoading: isContractWriteLoading,
    write,
  } = useContractWrite(config);

  useEffect(() => {
    const unixTime = Math.floor(Date.now() / 1000);
    setNextTokenId(unixTime);
  }, []);

  const onMint = useCallback(() => {
    setIsLoading(true);
    // mintNFTを呼び出す

    const json = {
      name: groupName,
      description:
        "StudySplash🌊📚 is the cutting-edge cohort-based learning platform in the web3 space. Leveraging ERC6551, it records user interactions and course participations on the blockchain, fostering vibrant communication within cohorts and maintaining consistent learning motivation.",
      image: imageUrl,
    };
    uploadGroupToS3(json);
    console.log("mintNFT");
    write?.();
  }, []);
  const { isLoading: isWaitContractLoading, isSuccess: isWaitContractSuccess } =
    useWaitForTransaction({
      hash: writeData?.hash,
    });

  useEffect(() => {
    //TODO: 失敗したとき
    if (isWaitContractSuccess) {
      toast({
        title: `NFT minted successfully!`,
        status: "success",
        duration: 2000,
      });
      setIsLoading(false);

      router.push("/dashboard");
    }
  }, [isWaitContractSuccess]);

  const uploadGroupToS3 = async (jsonData: any) => {
    const response = await fetch("/api/uploadgroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: nextTokenId, jsonContent: jsonData }),
    });
    const result = await response.json();
    if (response.ok) {
      console.log("Uploaded successfully:", result.url);
    } else {
      console.error("Error uploading:", result.error);
    }
  };

  const { value, getRadioProps } = useRadioGroup({
    defaultValue: "1",
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
