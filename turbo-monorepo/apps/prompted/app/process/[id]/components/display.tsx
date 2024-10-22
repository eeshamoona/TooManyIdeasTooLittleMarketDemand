"use client";
import { useState, useEffect } from "react";
import { Button, Text, Box } from "@mantine/core";
import { LevelInformation } from "./level-animation";
import LevelProgressAnimation from "./level-animation";
import MilestoneProgressAnimation from "./milestone-animation";
import { useRouter } from "next/navigation";

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
  entryId: number;
}

export default function Display({ badgeProgress, entryId }: DisplayProps) {
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (badgeProgress.length === 0) {
      router.push(`/read/${entryId}`);
    } else {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [badgeProgress, entryId, router]);

  // Subcomponent to handle rendering of Level Progress Animations
  const renderLevelProgressAnimations = () => {
    return badgeProgress
      ?.filter((badge) => badge.level)
      .map((badge) => (
        <Box
          key={badge.badgeId}
          style={{
            maxWidth: "300px",
            margin: "0 auto", // Center the box
            textAlign: "center", // Center the content
          }}
        >
          <LevelProgressAnimation
            levelInfo={badge.level!} // Non-null assertion since it's already filtered
            title={badge.badgeTitle}
            description={badge.badgeDescription}
            icon={badge.badgeIcon}
            label={badge.badgeLabel}
          />
        </Box>
      ));
  };

  // Subcomponent to handle rendering of Milestone Progress Animations
  const renderMilestoneProgressAnimations = () => {
    return badgeProgress
      ?.filter((badge) => !badge.level) // Only render milestones
      .map((badge) => (
        <MilestoneProgressAnimation
          title={badge.badgeTitle}
          description={badge.badgeDescription}
          icon={badge.badgeIcon}
          key={badge.badgeId}
        />
      ));
  };

  const goToReadPage = () => {
    router.push(`/read/${entryId}`);
  };

  return (
    <div>
      {/* Conditionally render text content for level up */}
      {badgeProgress.some((badge) => badge.level) && (
        <Text ta="center" size="lg" mt="lg" mb="lg">
          Congrats you leveled up!
        </Text>
      )}

      {/* Render Level Progress Animations */}
      {renderLevelProgressAnimations()}

      {/* Conditionally render text content for milestone */}
      {badgeProgress.some((badge) => !badge.level) && (
        <Text ta="center" size="lg" mt="lg" mb="lg">
          You've reached a milestone!
        </Text>
      )}

      {/* Render Milestone Progress Animations */}
      {renderMilestoneProgressAnimations()}

      {/* Show the button after 2 seconds */}
      {showButton && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button onClick={goToReadPage}>View Read Page</Button>
        </div>
      )}
    </div>
  );
}
