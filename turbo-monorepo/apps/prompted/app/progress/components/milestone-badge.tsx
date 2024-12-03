"use client";
import { Text, Tooltip } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { getIconComponent } from "../interface";
import "./milestone-badge.css";

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

  let IconComponent = getIconComponent(icon);

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
    <div>
      <Tooltip
        disabled={hidden}
        label={description}
        position="right"
        multiline
        w="auto"
        maw={150}
        offset={8}
        transitionProps={{ transition: "pop" }}
        openDelay={300}
      >
        <div
          className={`hex ${hidden ? "hidden" : ""}`}
          style={{
            cursor: "pointer",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleOnClick}
        >
          {debouncedHovered && hidden ? (
            <div className={`description-container ${hidden ? "hidden" : ""}`}>
              <Text style={{ fontSize: "1em" }}>
                {"Write more to unlock this!"}
              </Text>
            </div>
          ) : (
            <>
              <div className={`new-icon-container ${hidden ? "hidden" : ""}`}>
                {IconComponent && <IconComponent size={hidden ? 50 : 36} />}
              </div>
            </>
          )}
        </div>
      </Tooltip>
    </div>
  );
};

export default MilestoneBadge;
