import ParticleSystem from "./components/ParticleSystem";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium text-white/90 text-center mb-8">Particle Battle</h1>
        <ParticleSystem />
      </div>
    </main>
  );
}
