import {
  Box,
  Flex,
  Heading,
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
} from "@chakra-ui/react";
import React from "react";
import { useSelectCountryCtx } from "../contexts/selectContext";
import { InfoIcon, EmailIcon, ViewIcon } from "@chakra-ui/icons";

// ------------- COMPONENT -------------

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
  const { setSelectedCountry } = useSelectCountryCtx();
  return (
    <Flex
      gridArea="header"
      align="center"
      justify="center"
      bg="gray.800"
      color="gray.400"
    >
      <Heading
        fontSize={{ base: "xl", lg: "3xl" }}
        onClick={() => setSelectedCountry("")}
        cursor="pointer"
      >
        Covid-19 Information Dashboard
      </Heading>
      <Box position="absolute" right={10}>
        <InfoIcon cursor="pointer" onClick={onOpen} />
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
                <EmailIcon /> jon.ganebski@gmail.com
              </Text>
              <Link
                href="https://github.com/jonganebski/covid-19-dashboard"
                target="_blank"
              >
                <ViewIcon /> See code in Github
              </Link>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default Header;
