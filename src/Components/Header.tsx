import {
  Box,
  Flex,
  Heading,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/core";
import React from "react";

// ------------- COMPONENT -------------

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex
      gridArea="header"
      align="center"
      justify="center"
      bg="gray.800"
      color="gray.400"
    >
      <Heading> Covid-19 Information Dashboard</Heading>
      <Box position="absolute" right={10}>
        <Icon name="info" cursor="pointer" onClick={onOpen} />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay></ModalOverlay>
          <ModalContent>
            <ModalHeader>About</ModalHeader>
            <ModalCloseButton></ModalCloseButton>
            <ModalBody>
              <Text mb={4}>
                Hello. This is my small project clone coding{" "}
                <Link
                  href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6"
                  target="_blank"
                >
                  this site
                </Link>{" "}
                with Typescript. If you have any advices or suggestions, please
                constact me.
              </Text>
              <Text>Data sources: </Text>
              <Link
                href="https://github.com/CSSEGISandData/COVID-19"
                target="_blank"
                display="block"
              >
                COVID-19 Data Repository by the Center for Systems Science and
                Engineering (CSSE) at Johns Hopkins University
              </Link>
              <Link href="https://news.google.com/" target="_blank">
                Google News
              </Link>
            </ModalBody>
            <ModalFooter display="block">
              <Text>
                <Icon name="email" /> jon.ganebski@gmail.com
              </Text>
              <Link>
                <Icon name="view" /> See code in Github
              </Link>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default Header;
