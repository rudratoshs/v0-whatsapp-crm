"use client"

import { useState } from "react"
import type { Flow } from "@/lib/types"
import { Card } from "@/components/ui/card"

interface FlowBuilderProps {
  flow: Flow
  setFlow: (flow: Flow) => void
}

export function FlowBuilder({ flow, setFlow }: FlowBuilderProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="border border-border rounded-lg bg-card h-full p-8 relative overflow-auto">
        {/* Canvas */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {flow.edges.map((edge, idx) => {
            const sourceNode = flow.nodes.find((n) => n.id === edge.source)
            const targetNode = flow.nodes.find((n) => n.id === edge.target)
            if (!sourceNode || !targetNode) return null
            return (
              <line
                key={idx}
                x1={sourceNode.position.x + 60}
                y1={sourceNode.position.y + 40}
                x2={targetNode.position.x + 60}
                y2={targetNode.position.y}
                stroke="#6B7280"
                strokeWidth={2}
              />
            )
          })}
        </svg>

        {/* Nodes */}
        <div className="relative">
          {flow.nodes.map((node) => (
            <Card
              key={node.id}
              className={`absolute w-32 p-3 border cursor-pointer transition-all ${
                selectedNode === node.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
              style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
              }}
              onClick={() => setSelectedNode(node.id)}
            >
              <p className="text-xs font-semibold text-foreground text-center">{node.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
