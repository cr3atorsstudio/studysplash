import { Box, Image, Text, chakra, useRadio } from "@chakra-ui/react";

const CustomRadio = (props: any) => {
  const { image, isEmoji, ...radioProps } = props;

  const { state, getInputProps, getRadioProps, htmlProps, getLabelProps } =
    useRadio(radioProps);
  return (
    <chakra.label {...htmlProps} cursor="pointer">
      <input {...getInputProps({})} hidden />
      <Box
        {...getRadioProps()}
        // bg={state.isChecked ? "#111111" : "transparent"}
        w={"full"}
        border={state.isChecked ? "2px solid #111111" : "3px solid transparent"}
      >
        {isEmoji ? (
          <Text fontSize={"3xl"} p={2}>
            {image}
          </Text>
        ) : (
          <Image src={image} {...getLabelProps()} />
        )}
      </Box>
    </chakra.label>
  );
};

export default CustomRadio;
