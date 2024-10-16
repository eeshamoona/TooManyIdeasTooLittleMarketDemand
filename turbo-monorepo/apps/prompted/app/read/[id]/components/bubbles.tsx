import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import { MantineColorScheme } from "@mantine/core";

const THICCNESS = 60;

interface WordFrequencyDictionary {
  [key: string]: number;
}

interface MatterCirclesProps {
  colorScheme: MantineColorScheme;
  word_freq: WordFrequencyDictionary;
}

const MatterCircles: React.FC<MatterCirclesProps> = ({
  word_freq,
  colorScheme,
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create();
    engine.gravity.scale = 0; // Adjust gravity scale to simulate moon gravity
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    engineRef.current = engine;

    const leftWall = Matter.Bodies.rectangle(
      0 - THICCNESS / 2,
      sceneRef.current.clientHeight / 2,
      THICCNESS,
      sceneRef.current.clientHeight,
      { isStatic: true },
    );

    const rightWall = Matter.Bodies.rectangle(
      sceneRef.current.clientWidth + THICCNESS / 2,
      sceneRef.current.clientHeight / 2,
      THICCNESS,
      sceneRef.current.clientHeight,
      { isStatic: true },
    );

    const ceiling = Matter.Bodies.rectangle(
      sceneRef.current.clientWidth / 2,
      0 - THICCNESS / 2,
      sceneRef.current.clientWidth,
      THICCNESS,
      { isStatic: true },
    );

    const maxFreq = Math.max(...Object.values(word_freq));

    const MIN_SIZE = 15; // Reduced minimum size for the circles
    const MAX_SIZE = 75; // Reduced maximum size for the circles

    const circles = Object.entries(word_freq).map(([word, freq]) => {
      const size = MIN_SIZE + (freq / maxFreq) * (MAX_SIZE - MIN_SIZE); // Normalize size
      const circle = Matter.Bodies.circle(
        Math.random() * sceneRef.current.clientWidth,
        Math.random() * sceneRef.current.clientHeight,
        size,
        {
          friction: 0.3,
          frictionAir: 0.0001,
          restitution: 0.8,
          render: {
            fillStyle: colorScheme === "dark" ? "transparent" : "",
            strokeStyle: colorScheme === "dark" ? "white" : "black",
            lineWidth: 1,
          },
        },
      );
      circle.label = `${word} (${freq})`;
      return circle;
    });

    const ground = Matter.Bodies.rectangle(
      sceneRef.current.clientWidth / 2,
      sceneRef.current.clientHeight + THICCNESS / 2,
      sceneRef.current.clientWidth,
      THICCNESS,
      { isStatic: true },
    );

    Matter.Composite.add(engine.world, [
      leftWall,
      rightWall,
      ceiling,
      ground,
      ...circles,
    ]);

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    Matter.Events.on(render, "afterRender", function () {
      const context = render.context;
      context.fillStyle = colorScheme === "dark" ? "white" : "black";

      circles.forEach((circle) => {
        const { position, label } = circle;
        const fontSize = Math.max(8, 16 - label.length); // Minimum font size is 8px
        context.font = `${fontSize}px Arial`;
        const textWidth = context.measureText(label).width;
        context.fillText(
          label,
          position.x - textWidth / 2,
          position.y + 8, // Adjusted to vertically center the text
        );
      });
    });

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Matter.Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    const handleResize = () => {
      if (!sceneRef.current) return;
      render.canvas.width = sceneRef.current.clientWidth;
      render.canvas.height = sceneRef.current.clientHeight;
      Matter.Body.setPosition(
        ground,
        Matter.Vector.create(
          sceneRef.current.clientWidth / 2,
          sceneRef.current.clientHeight + THICCNESS / 2,
        ),
      );
      Matter.Body.setPosition(
        leftWall,
        Matter.Vector.create(
          0 - THICCNESS / 2,
          sceneRef.current.clientHeight / 2,
        ),
      );
      Matter.Body.setPosition(
        rightWall,
        Matter.Vector.create(
          sceneRef.current.clientWidth + THICCNESS / 2,
          sceneRef.current.clientHeight / 2,
        ),
      );
      Matter.Render.setPixelRatio(render, window.devicePixelRatio);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      Matter.Render.stop(render);
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
    };
  }, [word_freq, colorScheme]);

  return (
    <div
      ref={sceneRef}
      style={{
        width: "100%",
        height: "75%",
      }}
    />
  );
};

export default MatterCircles;
