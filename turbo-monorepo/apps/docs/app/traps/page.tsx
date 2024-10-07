"use client";
import { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Divider,
  Input,
  Button,
} from "@chakra-ui/react";

interface TodoItem {
  id: number;
  text: string;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim() === "") return;
    setTodos([...todos, { id: Date.now(), text: newTodo }]);
    setNewTodo("");
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Todo App</Heading>
      <VStack spacing={4} align="stretch">
        {todos.map((todo) => (
          <Box key={todo.id} p={5} shadow="md" borderWidth="1px">
            <HStack justify="space-between">
              <Text>{todo.text}</Text>
            </HStack>
          </Box>
        ))}
        <Divider />
        <HStack>
          <Input
            placeholder="New todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <Button colorScheme="teal" onClick={addTodo}>
            Add Todo
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
