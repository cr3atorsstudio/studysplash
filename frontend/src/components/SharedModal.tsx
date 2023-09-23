import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useCallback } from "react";

interface Props {
  children: React.ReactNode;
  size?: string;
}

const SharedModal = ({ children, size }: Props) => {
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    onModalOpen();
  }, [onModalOpen]);

  const onCloseModal = useCallback(() => {
    onAlertOpen();
  }, [onAlertOpen]);

  const onCancelRegister = useCallback(() => {
    onAlertClose();
    onModalClose();
    router.push("/");
  }, [onAlertClose, onModalClose]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onCloseModal} size={size} isCentered>
        <ModalContent rounded={"32px"} boxShadow={"lg"}>
          <ModalHeader>Register</ModalHeader>
          <ModalCloseButton color={"#FF7777"} />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isCentered
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              color={"#252627"}
            >
              Cancel Register
            </AlertDialogHeader>

            <AlertDialogBody color={"#252627"}>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Continue registration
              </Button>
              <Button colorScheme="red" onClick={onCancelRegister} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default SharedModal;
