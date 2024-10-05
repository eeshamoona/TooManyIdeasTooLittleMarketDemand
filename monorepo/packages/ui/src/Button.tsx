import React from "react";
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

interface Props extends ButtonProps {}

export const Button: React.FC<Props> = (props) => <ChakraButton {...props} />;
