# API Folder

This folder contains the API functions for the project. Currently, there are two main functions available:

1. **addPrompt**
2. **addTodo**
3. **saveEntry**

## Functions

### 1. addPrompt

The `addPrompt` function is responsible for adding a new prompt to the system. This function takes in the necessary parameters and processes them to store the prompt.

#### Usage

```typescript
import { addPrompt } from "./path/to/api";

const newPrompt = {
  text: "New Prompt",
  category: "General",
};

addPrompt(newPrompt)
  .then((response) => {
    console.log("Prompt added successfully:", response);
  })
  .catch((error) => {
    console.error("Error adding prompt:", error);
  });
```

### 2. addTodo

The `addTodo` function is responsible for adding a new todo item to the system. This function takes in the necessary parameters and processes them to store the todo item.

Usage

```typescript
import { addTodo } from "./path/to/api";

const newTodo = {
  text: "New Todo Title",
};

addTodo(newTodo)
  .then((response) => {
    console.log("Todo added successfully:", response);
  })
  .catch((error) => {
    console.error("Error adding todo:", error);
  });
```

### 3. saveEntry

The `saveEntry` function is responsible for saving a new entry to the system. This function takes in the necessary parameters and processes them to store the entry.

Usage

```typescript
import { saveEntry } from "./path/to/api";

const newEntry = {
  text: "New Entry Text",
  userId: "user123",
  category: "General",
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

saveEntry(newEntry)
  .then((response) => {
    console.log("Entry saved successfully:", response);
  })
  .catch((error) => {
    console.error("Error saving entry:", error);
  });
```
