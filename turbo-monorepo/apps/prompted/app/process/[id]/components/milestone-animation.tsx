import React, { useState, useEffect } from "react";
import { Text } from "@mantine/core";
import MilestoneBadge from "../../../progress/components/milestone-badge";

export interface MilestoneProgressAnimationProps {
  title: string;
  description: string;
  icon: string;
}

const MilestoneProgressAnimation: React.FC<MilestoneProgressAnimationProps> = ({
  title,
  description,
  icon,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <MilestoneBadge
        title={title}
        hidden={!isVisible}
        icon={icon}
        description={description}
      />
      <Text ta="center" size="md">
        {title}
      </Text>
    </>
  );
};

export default MilestoneProgressAnimation;
