import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Create a separate chart component for better organization
const PopulationChart = ({ data }: { data: Array<any> }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[300px] rounded-lg bg-zinc-900 border border-white/10 p-6">
        <div className="text-sm text-white/60 mb-4">
          Population Graph - Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px] rounded-lg bg-zinc-900 border border-white/10 p-6">
      <div className="text-sm text-white/60 mb-4">
        Population Graph - Watch how the particle counts change over time
      </div>
      <LineChart
        width={600}
        height={250}
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
        <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)">
          <Label value="Time" position="bottom" fill="rgba(255,255,255,0.6)" />
        </XAxis>
        <YAxis stroke="rgba(255,255,255,0.6)">
          <Label
            value="Count"
            angle={-90}
            position="left"
            fill="rgba(255,255,255,0.6)"
          />
        </YAxis>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "white",
          }}
        />
        <Line
          type="monotone"
          dataKey="rock"
          stroke="#ef4444"
          name="Rock "
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="paper"
          stroke="#22c55e"
          name="Paper "
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="scissors"
          stroke="#3b82f6"
          name="Scissors "
          strokeWidth={2}
        />
      </LineChart>
    </div>
  );
};

export default PopulationChart;
