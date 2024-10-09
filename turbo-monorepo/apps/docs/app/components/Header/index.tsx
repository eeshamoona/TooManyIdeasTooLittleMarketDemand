"use client";

import { Flex, Box, Link, Text, Button } from "@chakra-ui/react";
import { handleLogout } from "../../logout/logoutClient";

const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <Box as="header" p={2} color="black">
      <Flex justify="space-between" align="center" mx="auto">
        <Text fontSize="xl" fontWeight="bold">
          Moona
        </Text>
        <Flex
          justify="space-between"
          alignContent={"center"}
          flex="1"
          maxW="md"
        >
          <Link
            href="/prompts"
            p={2}
            backgroundColor={"white"}
            borderRadius={"md"}
            _hover={{ textDecoration: "none", bg: "gray.300" }}
          >
            Prompts
          </Link>
          <Link
            href="/traps"
            p={2}
            backgroundColor={"white"}
            borderRadius={"md"}
            _hover={{ textDecoration: "none", bg: "gray.300" }}
          >
            Traps
          </Link>
          <Link
            href="/styled-components"
            p={2}
            backgroundColor={"white"}
            borderRadius={"md"}
            _hover={{ textDecoration: "none", bg: "gray.300" }}
          >
            Components
          </Link>
          {isLoggedIn && (
            <Button
              onClick={handleLogout}
              p={2}
              color={"white"}
              backgroundColor={"red.500"}
              borderRadius={"md"}
              _hover={{ textDecoration: "none", bg: "red.400" }}
            >
              Logout
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
