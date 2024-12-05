import { Card, useMantineColorScheme } from "@mantine/core";
import Image from "next/image";
import ShowStatsDark from "../../public/images/ShowStatsDark.gif";
import ShowStatsLight from "../../public/images/ShowStatsLight.gif";

export default async function ShowStats() {
  const colorScheme = useMantineColorScheme();

  return (
    <Card
      withBorder
      m={0}
      p={0}
      style={{
        width: "fit-content",
        height: "fit-content",
        textAlign: "center",
      }}
    >
      <Image
        src={
          colorScheme.colorScheme === "dark" ? ShowStatsDark : ShowStatsLight
        }
        alt="Stat Charts"
        height={275}
        objectFit="cover"
      />
    </Card>
  );
}
