import React from "react";
import { getBadgeColor, icon_map } from "../interface";
import "./level-badge.css";

interface LevelBadgeProps {
  level: number;
  icon: string;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, icon }) => {
  const IconComponent = icon_map[icon];
  const badgeColor = getBadgeColor(level);

  return (
    <div className="badge-container" style={{ backgroundColor: badgeColor }}>
      <div className="icon-container">
        {IconComponent && <IconComponent size={24} color="black" />}
      </div>
      <div className="level-text">Level {level}</div>
    </div>
  );
};

export default LevelBadge;
