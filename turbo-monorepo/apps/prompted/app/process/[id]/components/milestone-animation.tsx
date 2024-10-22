import React, { useState, useEffect } from "react";
import { Text, Transition } from "@mantine/core";
import MilestoneBadge from "../../../progress/components/milestone-badge";

export interface MilestoneProgressAnimationProps {
  title: string;
  description: string;
  icon: string;
  animated: boolean;
}

const MilestoneProgressAnimation: React.FC<MilestoneProgressAnimationProps> = ({
  title,
  description,
  icon,
  animated,
}) => {
  const [isVisible, setIsVisible] = useState(animated ? false : true);
  const [showDescription, setShowDescription] = useState(
    animated ? false : true
  );
  const [showTitle, setShowTitle] = useState(animated ? false : true);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      const titleTimer = setTimeout(() => {
        setShowTitle(true);
      }, 1000);

      const descriptionTimer = setTimeout(() => {
        setShowDescription(true);
      }, 2000);

      return () => {
        clearTimeout(timer);
        clearTimeout(titleTimer);
        clearTimeout(descriptionTimer);
      };
    }
  }, [animated]);

  return (
    <>
      <MilestoneBadge
        title={title}
        hidden={!isVisible}
        icon={icon}
        description={description}
      />
      <Transition
        mounted={showTitle}
        transition="fade-down"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Text fw="bold" ta="center" size="md" style={styles}>
            {title}
          </Text>
        )}
      </Transition>
      <Transition
        mounted={showDescription}
        transition="fade-down"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Text ta="center" size="md" style={styles}>
            {description}
          </Text>
        )}
      </Transition>
    </>
  );
};

export default MilestoneProgressAnimation;
