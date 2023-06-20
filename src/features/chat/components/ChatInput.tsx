import { Button, ButtonProps, Flex, Icon, Input, InputProps } from "@chakra-ui/react";
import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface Props {
  inputProps: InputProps;
  sendButtonProps: ButtonProps;
  micButtonProps: ButtonProps;
  isListening: boolean;
}

export const ChatInput: FC<Props> = (props) => {
  return (
    <Flex gap="2">
      {props.isListening ? (
        <Button
          bgColor="green.400"
          color="white"
          fontWeight="semibold"
          h="44px"
          textAlign="center"
          variant="filled"
          {...props.micButtonProps}
          w="100%"
        >
          🎙️ 聞き取り中...
        </Button>
      ) : (
        <Input
          backdropBlur="8px"
          backdropFilter="auto"
          bgColor="whiteAlpha.600"
          border="none"
          h="44px"
          {...props.inputProps}
        />
      )}

      <Button colorScheme="twitter" h="44px" w="44px" {...props.sendButtonProps}>
        <Icon as={PaperAirplaneIcon} />
      </Button>
      <Button colorScheme="green" h="44px" w="44px" {...props.micButtonProps}>
        <Icon as={MicrophoneIcon} />
      </Button>
    </Flex>
  );
};
