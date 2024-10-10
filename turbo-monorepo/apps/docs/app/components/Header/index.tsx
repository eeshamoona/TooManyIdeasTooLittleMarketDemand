"use client";

import {
  Flex,
  Box,
  Text,
  Button,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { handleLogout } from "../../logout/logoutClient";
import { FaMoon, FaSun } from "react-icons/fa";

const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      as="header"
      p={2}
      bg={colorMode === "light" ? "gray.100" : "gray.700"}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center" mx="auto">
        <Text fontSize="xl" fontWeight="bold">
          Moona
        </Text>

        <Box display="flex" alignItems="center" gap={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            variant="filled"
            color={colorMode === "light" ? "blue.600" : "orange.300"}
          />
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
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
