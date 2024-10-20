"use client";
import { Tabs } from "@mantine/core";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { TbFileArrowRight } from "react-icons/tb";
import { Display } from "./display_one";
import { Display2 } from "./display-two";
import { DisplayProps } from "../../components/display";

export const Shell = ({ prompts }: DisplayProps) => {
  return (
    <Tabs mt="xl" mb="lg" defaultValue="gallery">
      <Tabs.List grow>
        <Tabs.Tab value="gallery" leftSection={<TbFileArrowRight />}>
          Manual
        </Tabs.Tab>
        <Tabs.Tab value="messages" leftSection={<FaWandMagicSparkles />}>
          AI
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery">
        <Display prompts={prompts} />
      </Tabs.Panel>

      <Tabs.Panel value="messages">
        <Display2 prompts={prompts} />
      </Tabs.Panel>
    </Tabs>
  );
};
