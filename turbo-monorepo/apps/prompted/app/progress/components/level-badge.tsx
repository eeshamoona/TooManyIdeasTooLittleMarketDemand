import React from "react";
import { icon_map } from "../interface";

interface LevelProgressPageProps {
  level: number;
  icon: string;
}

//Based on the level and icon, render a badge of the level color and icon

const LevelBadge: React.FC<LevelProgressPageProps> = ({ level, icon }) => {
  const IconComponent = icon_map[icon];
  return (
    <div>
      <div>Level {level}</div>
      <div>{IconComponent && <IconComponent size={24} />}</div>
    </div>
  );
};

export default LevelBadge;
