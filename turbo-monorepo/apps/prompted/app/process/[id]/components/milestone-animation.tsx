import React from "react";

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
  return <div>{title}</div>;
};
export default MilestoneProgressAnimation;
