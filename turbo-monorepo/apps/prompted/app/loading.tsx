import { Center, Loader } from "@mantine/core";
import React from "react";

const Loading: React.FC = () => {
  return (
    <Center style={{ height: "100vh" }}>
      <Loader color="blue" size="lg" type="dots" />
    </Center>
  );
};

export default Loading;
