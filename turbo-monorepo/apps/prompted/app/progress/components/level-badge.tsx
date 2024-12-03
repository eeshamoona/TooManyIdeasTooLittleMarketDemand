import React from "react";
import { getBadgeColor } from "../interface";
import { getIconComponent } from "../interface2";
import "./level-badge.css";

interface LevelBadgeProps {
  level: number;
  icon: string;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, icon }) => {
  const IconComponent = getIconComponent(icon);
  const badgeColor = getBadgeColor(level);

  const blackWhiteThreshold = 4;

  return (
    <div className="badge-container" style={{ backgroundColor: badgeColor }}>
      <div className="icon-container">
        {IconComponent && (
          <IconComponent
            size={24}
            color={level < blackWhiteThreshold ? "black" : "white"}
          />
        )}
      </div>
      <div
        style={{ color: level < blackWhiteThreshold ? "black" : "white" }}
        className="level-text"
      >
        Level {level}
      </div>
    </div>
  );
};

export default LevelBadge;
