import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const FreeTalkModeModal: FC<Props> = (props) => {
  const router = useRouter();
  const { isOpen, onClose } = props;

  const onClickNormalMode = () => {
    localStorage.removeItem("diary");
    router.push("/talk");
  };

  const onClickLoveMode = () => {
    localStorage.removeItem("diary");
    router.push("/talk?mode=love");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>FreeTalkのモードを選択!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack gap="4" py="4">
            <Button colorScheme="messenger" onClick={onClickNormalMode} py="6">
              ノーマルモード
            </Button>
            <Button bgColor="pink.300" color="white" onClick={onClickLoveMode} py="6">
              恋愛シミュレーションモード
            </Button>
          </Stack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
