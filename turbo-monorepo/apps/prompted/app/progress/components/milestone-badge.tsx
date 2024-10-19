"use client";
import React, { useState } from "react";
import { icon_map } from "../interface";
import "./milestone-badge.css";
import { FaQuestionCircle } from "react-icons/fa";

interface MilestoneBadgeProps {
  hidden?: boolean;
  title: string;
  icon: string;
  description: string;
}

const MilestoneBadge: React.FC<MilestoneBadgeProps> = ({
  hidden,
  title,
  icon,
  description,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  let IconComponent = icon_map[icon];

  if (hidden) {
    IconComponent = FaQuestionCircle;
  }

  const handleOnClick = () => {
    if (hidden) {
      console.log(`Title: ${title}\nDescription: ${description}`);
      return;
    }
  };

  return (
    <div
      className={`hex ${hidden ? "hidden" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOnClick}
    >
      {isHovered ? (
        <div className={`description-container ${hidden ? "hidden" : ""}`}>
          <span>{hidden ? "Write more to unlock this!" : description}</span>
        </div>
      ) : (
        <>
          <div className={`icon-container ${hidden ? "hidden" : ""}`}>
            {IconComponent && <IconComponent size={hidden ? 48 : 32} />}
          </div>
          <div className={`title-container ${hidden ? "hidden" : ""}`}>
            <span>{title}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default MilestoneBadge;
