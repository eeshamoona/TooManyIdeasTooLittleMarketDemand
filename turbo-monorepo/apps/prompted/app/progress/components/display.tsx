import { Tabs } from "@mantine/core";

export default async function Read() {
  return (
    <>
      <Tabs defaultValue="first">
        <Tabs.List justify="center">
          <Tabs.Tab value="first">First tab</Tabs.Tab>
          <Tabs.Tab value="second">Second tab</Tabs.Tab>
          <Tabs.Tab value="third">Third tab</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </>
  );
}
