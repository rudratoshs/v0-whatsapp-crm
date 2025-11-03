"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function HealthMetrics() {
  const data = [
    { time: "00:00", uptime: 99.8, latency: 45 },
    { time: "04:00", uptime: 99.9, latency: 42 },
    { time: "08:00", uptime: 99.7, latency: 48 },
    { time: "12:00", uptime: 100, latency: 40 },
    { time: "16:00", uptime: 99.95, latency: 43 },
    { time: "20:00", uptime: 99.85, latency: 46 },
    { time: "24:00", uptime: 99.9, latency: 44 },
  ]

  return (
    <Card className="p-6 border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6">System Health</h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Uptime</p>
          <p className="text-2xl font-bold text-green-500">99.9%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Avg Latency</p>
          <p className="text-2xl font-bold text-blue-500">44ms</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Error Rate</p>
          <p className="text-2xl font-bold text-green-500">0.01%</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="uptime" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
