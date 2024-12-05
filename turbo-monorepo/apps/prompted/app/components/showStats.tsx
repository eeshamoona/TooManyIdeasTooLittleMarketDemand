import { Card, useMantineColorScheme } from "@mantine/core";
import Image from "next/image";
import ReadPageDark from "../../public/images/ReadPageDark.gif";
import ReadPageLight from "../../public/images/ReadPageLight.gif";
import ShowStatsDark from "../../public/images/ShowStatsDark.gif";
import ShowStatsLight from "../../public/images/ShowStatsLight.gif";

export default async function ShowStats({ isStats }: { isStats: boolean }) {
  const colorScheme = useMantineColorScheme();

  return (
    <Card
      withBorder
      m={0}
      p={0}
      radius={"md"}
      style={{
        width: "fit-content",
        height: "100%",
        textAlign: "center",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: isStats ? "center" : "flex-start",
      }}
    >
      <Image
        src={
          isStats
            ? colorScheme.colorScheme === "dark"
              ? ShowStatsDark
              : ShowStatsLight
            : colorScheme.colorScheme === "dark"
              ? ReadPageDark
              : ReadPageLight
        }
        alt="Stat Charts"
        width={500}
        height={450}
        unoptimized
      />
    </Card>
  );
}
