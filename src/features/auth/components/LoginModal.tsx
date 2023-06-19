import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { useAuth } from "../hooks/useAuth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const { loginWithGoogle } = useAuth();
  const { data } = useSession();
  console.log(data);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button onClick={loginWithGoogle} py="6" w="100%">
            Googleログイン
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="outline">
            閉じる
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
