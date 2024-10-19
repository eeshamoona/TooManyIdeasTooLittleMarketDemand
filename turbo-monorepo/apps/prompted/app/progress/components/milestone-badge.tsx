"use client";
import React, { useState } from "react";
import { icon_map } from "../interface";
import "./milestone-badge.css";
import { FaQuestionCircle } from "react-icons/fa";
import { Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

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
  const [debouncedHovered] = useDebouncedValue(isHovered, 10);

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

  // Function to determine font size based on title length
  const getFontSize = (title: string) => {
    if (title.length <= 5) return "1.5em";
    if (title.length <= 10) return "1.3em";
    if (title.length <= 15) return "1.1em";
    if (title.length <= 20) return "1em";
    if (title.length <= 20) return "0.9em";
    if (title.length <= 25) return "0.8em";
    return "0.7em";
  };
  const fontSize = getFontSize(title);

  return (
    <div
      className={`hex ${hidden ? "hidden" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOnClick}
    >
      {debouncedHovered ? (
        <div className={`description-container ${hidden ? "hidden" : ""}`}>
          <Text span style={{ fontSize: "1em" }}>
            {hidden ? "Write more to unlock this!" : description}
          </Text>
        </div>
      ) : (
        <>
          <div className={`new-icon-container ${hidden ? "hidden" : ""}`}>
            {IconComponent && <IconComponent size={hidden ? 48 : 32} />}
          </div>
          <div className={`ribbon ${hidden ? "hidden" : ""}`}>
            <Text span style={{ fontSize }}>
              {title}
            </Text>
          </div>
        </>
      )}
    </div>
  );
};

export default MilestoneBadge;
