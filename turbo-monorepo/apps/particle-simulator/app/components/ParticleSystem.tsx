"use client";
import Matter from "matter-js";
import { useCallback, useEffect, useRef, useState } from "react";
import PopulationChart from "./PopulationChart";

type ParticleType = "rock" | "paper" | "scissors";

interface ParticleConfig {
  color: string;
  label: string;
  emoji: string;
  defeats: ParticleType;
}

const PARTICLE_CONFIG: Record<ParticleType, ParticleConfig> = {
  rock: { color: "#ef4444", label: "Rock", emoji: "🪨", defeats: "scissors" },
  paper: { color: "#22c55e", label: "Paper", emoji: "📄", defeats: "rock" },
  scissors: {
    color: "#3b82f6",
    label: "Scissors",
    emoji: "✂️",
    defeats: "paper",
  },
};

interface SimulationConfig {
  particleCounts: Record<ParticleType, number>;
  particleSize: number;
  simulationSpeed: number;
}

interface ParticleCounts {
  rock: number;
  paper: number;
  scissors: number;
  timestamp: number;
}

const DEFAULT_CONFIG: SimulationConfig = {
  particleCounts: {
    rock: 10,
    paper: 10,
    scissors: 10,
  },
  particleSize: 15,
  simulationSpeed: 1,
};

const MAX_DATA_POINTS = 50;

const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const rendererRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [winner, setWinner] = useState<ParticleType | null>(null);
  const [particleCounts, setParticleCounts] = useState<ParticleCounts[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [userPrediction, setUserPrediction] = useState<ParticleType | null>(
    null
  );
  const [prediction, setPrediction] = useState<ParticleType | null>(null);
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [step, setStep] = useState(0);
  const [showSetup, setShowSetup] = useState(true);

  const updateCanvasSize = useCallback(() => {
    if (!containerRef.current || !rendererRef.current) return;

    const container = containerRef.current;
    const maxWidth = Math.min(800, container.clientWidth);
    const height = (maxWidth * 3) / 4;

    if (rendererRef.current.canvas) {
      rendererRef.current.canvas.width = maxWidth;
      rendererRef.current.canvas.height = height;
      rendererRef.current.options.width = maxWidth;
      rendererRef.current.options.height = height;
    }
  }, []);

  const predictWinner = useCallback((counts: ParticleCounts) => {
    const total = counts.rock + counts.paper + counts.scissors;
    if (total === 0) return null;

    const rockStrength = (counts.rock / total) * (counts.scissors / total);
    const paperStrength = (counts.paper / total) * (counts.rock / total);
    const scissorsStrength = (counts.scissors / total) * (counts.paper / total);

    const max = Math.max(rockStrength, paperStrength, scissorsStrength);
    if (max === rockStrength) return "rock";
    if (max === paperStrength) return "paper";
    return "scissors";
  }, []);

  const cleanupSimulation = useCallback(() => {
    if (rendererRef.current) Matter.Render.stop(rendererRef.current);
    if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    if (engineRef.current) Matter.Engine.clear(engineRef.current);
  }, []);

  const createParticle = useCallback(
    (type: ParticleType, x: number, y: number, size: number): Matter.Body => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 1.5 + Math.random();

      const particle = Matter.Bodies.circle(x, y, size, {
        restitution: 0.9 + Math.random() * 0.2,
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        density: 0.1,
        render: {
          fillStyle: PARTICLE_CONFIG[type].color,
          strokeStyle: "#FFFFFF",
          lineWidth: 1,
        },
        label: type,
        plugin: {
          initialSpeed: velocity,
        },
      });

      Matter.Body.setVelocity(particle, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
      });

      return particle;
    },
    []
  );

  const initializeSimulation = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Reset states
    setWinner(null);
    setParticleCounts([]);
    setIsRunning(true);

    const container = containerRef.current;
    const maxWidth = Math.min(800, container.clientWidth);
    const height = (maxWidth * 3) / 4;

    const engine = Matter.Engine.create({
      enableSleeping: false,
      gravity: { x: 0, y: 0, scale: 0 },
    });
    engineRef.current = engine;

    const renderer = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: maxWidth,
        height: height,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio,
      },
    });
    rendererRef.current = renderer;

    // Create walls
    const walls = [
      Matter.Bodies.rectangle(maxWidth / 2, 0, maxWidth, 40, {
        isStatic: true,
        restitution: 0.9 + Math.random() * 0.2,
        friction: 0,
        render: { visible: false },
      }),
      Matter.Bodies.rectangle(maxWidth / 2, height, maxWidth, 40, {
        isStatic: true,
        restitution: 0.9 + Math.random() * 0.2,
        friction: 0,
        render: { visible: false },
      }),
      Matter.Bodies.rectangle(0, height / 2, 40, height, {
        isStatic: true,
        restitution: 0.9 + Math.random() * 0.2,
        friction: 0,
        render: { visible: false },
      }),
      Matter.Bodies.rectangle(maxWidth, height / 2, 40, height, {
        isStatic: true,
        restitution: 0.9 + Math.random() * 0.2,
        friction: 0,
        render: { visible: false },
      }),
    ];

    // Create initial particles
    const particles: Matter.Body[] = [];
    const types: ParticleType[] = ["rock", "paper", "scissors"];

    types.forEach((type) => {
      const count = config.particleCounts[type];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = Math.min(maxWidth, height) * 0.25;
        const x = maxWidth / 2 + Math.cos(angle) * radius;
        const y = height / 2 + Math.sin(angle) * radius;
        particles.push(createParticle(type, x, y, config.particleSize));
      }
    });

    setPrediction(predictWinner(config.particleCounts as ParticleCounts));

    const updateParticleCounts = () => {
      const bodies = Matter.Composite.allBodies(engine.world);
      const counts = {
        rock: 0,
        paper: 0,
        scissors: 0,
        timestamp: Date.now(),
      };

      bodies.forEach((body) => {
        if (body.label in counts) {
          counts[body.label as ParticleType]++;
        }
      });

      setParticleCounts((prev) => {
        const newCounts = [...prev, counts];
        return newCounts.slice(-MAX_DATA_POINTS);
      });
    };

    // Collision handling
    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const typeA = bodyA.label as ParticleType;
        const typeB = bodyB.label as ParticleType;

        if (typeA !== typeB) {
          if (
            PARTICLE_CONFIG[typeA] &&
            PARTICLE_CONFIG[typeA].defeats === typeB
          ) {
            bodyB.render.fillStyle = PARTICLE_CONFIG[typeA].color;
            bodyB.label = typeA;
          } else if (
            PARTICLE_CONFIG[typeB] &&
            PARTICLE_CONFIG[typeB].defeats === typeA
          ) {
            bodyA.render.fillStyle = PARTICLE_CONFIG[typeB].color;
            bodyA.label = typeB;
          } else {
            console.warn(`Invalid typeA: ${typeA} or typeB: ${typeB}`);
          }
          updateParticleCounts();
        }
      });
    });

    // Maintain particle speeds
    Matter.Events.on(engine, "afterUpdate", () => {
      const bodies = Matter.Composite.allBodies(engine.world);
      bodies.forEach((body) => {
        if (body.label in PARTICLE_CONFIG) {
          const currentVelocity = Matter.Vector.magnitude(body.velocity);
          const initialSpeed = (body as any).plugin.initialSpeed;

          if (Math.abs(currentVelocity - initialSpeed) > 0.1) {
            const scale = initialSpeed / currentVelocity;
            Matter.Body.setVelocity(body, {
              x: body.velocity.x * scale,
              y: body.velocity.y * scale,
            });
          }
        }
      });

      const particleTypes = new Set(
        bodies
          .filter((body) => body.label in PARTICLE_CONFIG)
          .map((body) => body.label)
      );

      if (particleTypes.size === 1) {
        setWinner(Array.from(particleTypes)[0] as ParticleType);
        setIsRunning(false);
      }
    });

    Matter.Composite.add(engine.world, [...walls, ...particles]);

    const runner = Matter.Runner.create({
      isFixed: true,
      delta: 1000 / 60 / config.simulationSpeed,
    });
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
    Matter.Render.run(renderer);

    updateParticleCounts();
  }, [config, createParticle, predictWinner]);

  useEffect(() => {
    if (runnerRef.current) {
      runnerRef.current.delta = 1000 / 60 / config.simulationSpeed;
    }
  }, [config.simulationSpeed]);

  useEffect(() => {
    return cleanupSimulation;
  }, [cleanupSimulation]);

  useEffect(() => {
    const handleResize = () => updateCanvasSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateCanvasSize]);

  const handleRestart = useCallback(() => {
    cleanupSimulation();
    setShowSetup(true);
    setUserPrediction(null);
    setWinner(null);
    setParticleCounts([]);
    setIsRunning(false);
    setStep(0);
  }, [cleanupSimulation]);

  const handlePredictionSelect = useCallback(
    (type: ParticleType) => {
      setUserPrediction(type);
      setShowSetup(false);
      initializeSimulation();
    },
    [initializeSimulation]
  );

  const chartData = particleCounts.map((counts, index) => ({
    time: index,
    rock: counts.rock,
    paper: counts.paper,
    scissors: counts.scissors,
    total: counts.rock + counts.paper + counts.scissors,
  }));

  return (
    <div className="w-full max-w-7xl mx-auto">
      {showSetup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-2xl p-8 max-w-xl w-full mx-4 border border-white/10">
            <div className="relative">
              <div className="flex justify-center space-x-2 mb-8">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === step ? "w-8 bg-white" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>

              {step === 0 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="text-center">
                    <h2 className="text-2xl font-medium text-white mb-4">
                      Welcome to Particle Battle!
                    </h2>
                    <p className="text-white/60 mb-8">
                      Watch particles compete in an epic game of Rock, Paper,
                      Scissors!
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {(Object.keys(PARTICLE_CONFIG) as ParticleType[]).map(
                      (type) => (
                        <div
                          key={type}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-800/50"
                        >
                          <span className="text-3xl">
                            {PARTICLE_CONFIG[type].emoji}
                          </span>
                          <span
                            className="text-white/90"
                            style={{ color: PARTICLE_CONFIG[type].color }}
                          >
                            {PARTICLE_CONFIG[type].label}
                          </span>
                          <span className="text-white/60 text-sm">
                            defeats{" "}
                            {
                              PARTICLE_CONFIG[PARTICLE_CONFIG[type].defeats]
                                .emoji
                            }
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                  >
                    Next: Setup Particles
                  </button>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-medium text-white mb-2">
                      Configure Your Particles
                    </h2>
                    <p className="text-white/60">
                      Adjust the counts and size to create your perfect battle!
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="text-sm text-white/60 mb-4">
                      Adjust the number of particles for each type
                    </div>
                    {(Object.keys(PARTICLE_CONFIG) as ParticleType[]).map(
                      (type) => (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {PARTICLE_CONFIG[type].emoji}
                            </span>
                            <div className="flex items-center justify-between w-full">
                              <span
                                className="text-white/90"
                                style={{ color: PARTICLE_CONFIG[type].color }}
                              >
                                {PARTICLE_CONFIG[type].label}
                              </span>
                              <span className="text-white/90">
                                {config.particleCounts[type]}
                              </span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="30"
                            value={config.particleCounts[type]}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                particleCounts: {
                                  ...prev.particleCounts,
                                  [type]: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="w-full accent-white/20"
                          />
                        </div>
                      )
                    )}

                    <div>
                      <div className="text-sm text-white/60 mb-2">
                        Adjust particle size
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/90">Size</span>
                          <span className="text-white/90">
                            {config.particleSize}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          value={config.particleSize}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              particleSize: parseInt(e.target.value),
                            }))
                          }
                          className="w-full accent-white/20"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(0)}
                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                      >
                        Next: Make Prediction
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-white mb-2">
                      Make Your Prediction
                    </h3>
                    <p className="text-white/60">
                      Based on the particle counts, who do you think will win?
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {(Object.keys(PARTICLE_CONFIG) as ParticleType[]).map(
                      (type) => (
                        <button
                          key={type}
                          onClick={() => handlePredictionSelect(type)}
                          className="flex flex-col items-center gap-2 p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 transition-colors"
                        >
                          <span className="text-3xl">
                            {PARTICLE_CONFIG[type].emoji}
                          </span>
                          <span
                            className="text-white/90"
                            style={{ color: PARTICLE_CONFIG[type].color }}
                          >
                            {PARTICLE_CONFIG[type].label}
                          </span>
                          <div className="flex items-center gap-1 text-white/60 text-sm">
                            <span>{config.particleCounts[type]}</span>
                            <span>particles</span>
                          </div>
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                  >
                    Back to Setup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-zinc-900 border border-white/10 p-6">
            {isRunning && (
              <div className="mb-6">
                <div className="text-sm text-white/60 mb-2">
                  Adjust simulation speed
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/90 whitespace-nowrap">🐢</span>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={config.simulationSpeed}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        simulationSpeed: parseFloat(e.target.value),
                      }))
                    }
                    className="flex-1 accent-white/20"
                  />
                  <span className="text-white/90">🐇</span>
                </div>
              </div>
            )}

            <button
              onClick={handleRestart}
              className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
            >
              New Battle
            </button>

            {userPrediction && (
              <div className="mt-4 p-4 rounded-lg bg-zinc-800/50 border border-white/5">
                <div className="text-sm text-white/60 mb-2">
                  Your Prediction
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {PARTICLE_CONFIG[userPrediction].emoji}
                    </span>
                    <span className="text-white/90">
                      {PARTICLE_CONFIG[userPrediction].label}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div
            ref={containerRef}
            className="relative rounded-lg overflow-hidden bg-zinc-900 border border-white/10"
          >
            <canvas ref={canvasRef} className="w-full h-auto" />
            {winner && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">
                    {PARTICLE_CONFIG[winner].emoji}
                  </div>
                  <h2 className="text-2xl font-medium text-white mb-2">
                    {PARTICLE_CONFIG[winner].label} Wins!
                  </h2>
                  {userPrediction && (
                    <div className="text-xl">
                      {userPrediction === winner ? (
                        <p className="text-emerald-400">🎉 Great prediction!</p>
                      ) : (
                        <p className="text-rose-400">Better luck next time!</p>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                >
                  Start New Battle
                </button>
              </div>
            )}
          </div>

          <PopulationChart
            data={chartData.map((data, index) => ({
              time: index,
              rock: data.rock,
              paper: data.paper,
              scissors: data.scissors,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ParticleSystem;
