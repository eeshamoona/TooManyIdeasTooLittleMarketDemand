"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Box,
  Container,
  Text,
  SimpleGrid,
  Center,
  Flex,
} from "@mantine/core";
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
  const [currentIndex, setCurrentIndex] = useState(0); // Track current animation
  const [showAll, setShowAll] = useState(false); // Show all animations after sequence
  const [timer, setTimer] = useState(10); // Countdown timer
  const router = useRouter();

  useEffect(() => {
    if (badgeProgress.length === 0) {
      router.push(`/read/${entryId}`);
    }
  }, [badgeProgress, entryId, router]);

  // Automatically progress to next animation in the sequence
  useEffect(() => {
    if (!showAll && currentIndex < badgeProgress.length) {
      const animationTimer = setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 5000); // 5 seconds per animation
      return () => clearTimeout(animationTimer);
    } else {
      skipAnimations();
    }
  }, [currentIndex, showAll, badgeProgress.length]);

  // Countdown timer for routing to read page
  useEffect(() => {
    if (showAll) {
      const countdownTimer = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            goToReadPage();
            clearInterval(countdownTimer);
          }
          return prevTimer - 1;
        });
      }, 1000); // Decrement every second

      return () => clearInterval(countdownTimer);
    }
  }, [showAll, entryId, router]);

  const skipAnimations = () => {
    setShowAll(true);
  };

  const goToReadPage = () => {
    router.push(`/read/${entryId}`);
  };

  // Render a single animation based on current index
  const renderCurrentAnimation = () => {
    const badge = badgeProgress[currentIndex];

    if (badge.level) {
      return (
        <Container>
          <Text ta="center" size="xl">
            You Leveled Up!
          </Text>
          <Box
            key={badge.badgeId}
            style={{
              maxWidth: "300px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <LevelProgressAnimation
              levelInfo={badge.level!}
              title={badge.badgeTitle}
              description={badge.badgeDescription}
              icon={badge.badgeIcon}
              label={badge.badgeLabel}
              animated={true}
            />
          </Box>
        </Container>
      );
    } else {
      return (
        <Center>
          <Box
            key={badge.badgeId}
            style={{
              maxWidth: "300px",
            }}
          >
            <Text ta="center" size="xl">
              Milestone Reached!
            </Text>

            <MilestoneProgressAnimation
              title={badge.badgeTitle}
              description={badge.badgeDescription}
              icon={badge.badgeIcon}
              key={badge.badgeId}
              animated={true}
            />
          </Box>
        </Center>
      );
    }
  };

  const renderAllBadges = () => {
    const levelBadges = badgeProgress.filter((badge) => badge.level);
    const milestoneBadges = badgeProgress.filter((badge) => !badge.level);

    return (
      <SimpleGrid cols={2} spacing="lg">
        <Flex
          gap="sm"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          {levelBadges?.map((badge) => (
            <Box
              key={badge.badgeId}
              style={{
                maxWidth: "300px",
              }}
            >
              <LevelProgressAnimation
                levelInfo={badge.level!}
                title={badge.badgeTitle}
                description={badge.badgeDescription}
                icon={badge.badgeIcon}
                label={badge.badgeLabel}
                animated={false}
              />
            </Box>
          ))}
        </Flex>
        <Flex
          gap="sm"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
          mt="md"
        >
          {milestoneBadges?.map((badge) => (
            <Box
              key={badge.badgeId}
              style={{
                maxWidth: "300px",
              }}
            >
              <MilestoneProgressAnimation
                title={badge.badgeTitle}
                description={badge.badgeDescription}
                icon={badge.badgeIcon}
                animated={false}
              />
            </Box>
          ))}
        </Flex>
      </SimpleGrid>
    );
  };

  return (
    <div>
      {showAll && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button variant="light" fullWidth onClick={goToReadPage}>
            View Read Page in... {timer}
          </Button>
        </div>
      )}
      {/* Skip button to skip animation */}
      {!showAll && (
        <div style={{ justifyContent: "end", display: "flex" }}>
          <Button variant="subtle" color="red" onClick={skipAnimations}>
            Skip Animations
          </Button>
        </div>
      )}

      {!showAll && currentIndex < badgeProgress.length && (
        <div>{renderCurrentAnimation()}</div>
      )}

      {showAll && <div>{renderAllBadges()}</div>}
    </div>
  );
}
