import {
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody maxWidth={900} maxHeight={600} bgColor="gray.900" p={0}>
          <Image src={imgUrl} objectFit="cover" w="100%" maxHeight={600} />
        </ModalBody>
        <ModalFooter bg="gray.900" justifyContent="flex-start" py="1" px="2">
          <Link target="_blank" href={imgUrl}>
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
