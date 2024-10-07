"use client";

import { Flex, Box, Link, Text, Button } from "@chakra-ui/react";
import { handleLogout } from "../../logout/logoutClient";

const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <Box as="header" bg="white" p={4} color="black" boxShadow="md">
      <Flex justify="space-between" align="center" mx="auto">
        <Text fontSize="xl" fontWeight="bold">
          Moona
        </Text>
        <Flex justify="space-between" flex="1" maxW="md">
          <Link
            href="/"
            p={2}
            _hover={{ textDecoration: "none", bg: "gray.100" }}
          >
            Blog
          </Link>
          <Link
            href="/prompts"
            p={2}
            _hover={{ textDecoration: "none", bg: "gray.100" }}
          >
            Prompts
          </Link>
          <Link
            href="/traps"
            p={2}
            _hover={{ textDecoration: "none", bg: "gray.100" }}
          >
            Traps
          </Link>
          <Link
            href="/styled-components"
            p={2}
            _hover={{ textDecoration: "none", bg: "gray.100" }}
          >
            Components
          </Link>
          {isLoggedIn && (
            <Button
              onClick={handleLogout}
              p={2}
              _hover={{ textDecoration: "none", bg: "gray.100" }}
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
