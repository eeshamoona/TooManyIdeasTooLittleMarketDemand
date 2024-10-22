"use client";
import { LevelInformation } from "./level-animation";
import LevelProgressAnimation from "./level-animation";
import MilestoneProgressAnimation from "./milestone-animation";

interface BadgeProgress {
  badgeId: number;
  badgeTitle: string;
  badgeDescription: string;
  badgeLabel: string;
  badgeIcon: string;
  level?: LevelInformation;
  startValue: number;
  endValue: number;
  achieved?: boolean;
}

interface DisplayProps {
  badgeProgress: BadgeProgress[];
}

export default function Display({ badgeProgress }: DisplayProps) {
  //TODO: After animations are finished have a button show up to go to view the read page

  return (
    <div>
      {badgeProgress?.map((badge) => {
        if (badge.level) {
          return (
            <LevelProgressAnimation
              levelInfo={badge.level}
              title={badge.badgeTitle}
              description={badge.badgeDescription}
              icon={badge.badgeIcon}
              key={badge.badgeId}
              label={badge.badgeLabel}
            />
          );
        } else {
          return (
            <MilestoneProgressAnimation
              title={badge.badgeTitle}
              description={badge.badgeDescription}
              icon={badge.badgeIcon}
              key={badge.badgeId}
            />
          );
        }
      })}
    </div>
  );
}
