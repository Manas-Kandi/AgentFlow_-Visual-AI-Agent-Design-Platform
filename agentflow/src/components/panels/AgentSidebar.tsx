"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { microAgents } from "@/data/microAgents"

export function AgentSidebar() {
  const handleDragStart = (e: React.DragEvent, agentType: string) => {
    e.dataTransfer.setData('application/node-type', agentType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="w-80 border-r border-[var(--figma-border)] bg-[var(--figma-surface)] h-full">
      <div className="border-b border-[var(--figma-border)] p-4">
        <h2 className="font-medium text-[var(--figma-text)]">Micro-Agents</h2>
        <p className="text-sm text-[var(--figma-text-secondary)] mt-1">
          Drag agents onto the canvas to build your system
        </p>
      </div>

      <div className="p-4 space-y-4 h-full overflow-auto figma-scrollbar">
        <div>
          <h3 className="font-medium mb-3 text-sm text-[var(--figma-text)]">Core Agents</h3>
          <div className="space-y-2">
            {microAgents.map((agent) => {
              const IconComponent = agent.icon

              return (
                <Card
                  key={agent.id}
                  className="p-3 cursor-grab hover:bg-[var(--figma-bg)] transition-colors border-[var(--figma-border)] active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, agent.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${agent.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[var(--figma-text)]">{agent.name}</p>
                      <p className="text-xs text-[var(--figma-text-secondary)] mt-1">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-3 text-sm text-[var(--figma-text)]">Custom Agents</h3>
          <Card className="p-4 border-dashed border-2 border-[var(--figma-border)] text-center">
            <p className="text-sm text-[var(--figma-text-secondary)]">
              Create custom agents
            </p>
            <p className="text-xs text-[var(--figma-text-secondary)] mt-1">
              Coming soon...
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
