import { Flex, Box, Link, Text } from "@chakra-ui/react";

const Header = () => {
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
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
