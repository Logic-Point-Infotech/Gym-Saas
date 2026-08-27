'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Dumbbell, Users, RefreshCw, ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react'
import { useDeleteAllocation } from '@/hooks/use-allocations'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'

interface Node {
  id: string
  name: string
  email: string
  role: 'TRAINER' | 'CLIENT'
  avatarUrl: string | null
  specialization?: string | null
  status?: string
  // Dynamic coordinates
  x: number
  y: number
}

interface Link {
  id: string
  trainerId: string
  clientId: string
}

interface AllocationNetworkProps {
  allocations: any[]
  onSelectNode?: (node: any) => void
}

export function AllocationNetwork({ allocations, onSelectNode }: AllocationNetworkProps) {
  const { toast } = useToast()
  const deleteAllocationMutation = useDeleteAllocation()
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  // Zoom / Pan states
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  // Node position & drag states
  const [nodes, setNodes] = useState<Node[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // Process raw allocations into a visual graph structure
  useEffect(() => {
    if (!allocations || allocations.length === 0) return

    const tempNodes: Node[] = []
    const tempLinks: Link[] = []
    const trainerIds = new Set<string>()
    const clientIds = new Set<string>()

    // Identify unique trainers and clients
    allocations.forEach((alloc) => {
      const trainer = alloc.trainer
      const client = alloc.client

      if (trainer && !trainerIds.has(trainer.id)) {
        trainerIds.add(trainer.id)
        tempNodes.push({
          id: trainer.id,
          name: trainer.name,
          email: trainer.email,
          role: 'TRAINER',
          avatarUrl: trainer.avatarUrl,
          specialization: trainer.specialization,
          x: 0,
          y: 0,
        })
      }

      if (client && !clientIds.has(client.id)) {
        clientIds.add(client.id)
        tempNodes.push({
          id: client.id,
          name: client.name,
          email: client.email,
          role: 'CLIENT',
          avatarUrl: client.avatarUrl,
          status: client.status,
          x: 0,
          y: 0,
        })
      }

      if (trainer && client) {
        tempLinks.push({
          id: alloc.id,
          trainerId: trainer.id,
          clientId: client.id,
        })
      }
    })

    // Layout algorithm: Circular orbital topology
    // Trainers spaced evenly in a horizontal line or wide triangle
    const trainers = tempNodes.filter(n => n.role === 'TRAINER')
    const clients = tempNodes.filter(n => n.role === 'CLIENT')

    const width = canvasContainerRef.current?.clientWidth || 800
    const height = canvasContainerRef.current?.clientHeight || 500

    const trainerCoordsMap = new Map<string, { x: number; y: number }>()

    trainers.forEach((t, idx) => {
      // Position trainers spaced horizontally
      const x = width / 2 + (idx - (trainers.length - 1) / 2) * (width * 0.25)
      const y = height / 2 + (idx % 2 === 0 ? -40 : 40)
      t.x = x
      t.y = y
      trainerCoordsMap.set(t.id, { x, y })
    })

    // Clients cluster around their assigned trainer
    clients.forEach((c) => {
      // Find what trainer this client is allocated to
      const allocation = tempLinks.find(l => l.clientId === c.id)
      if (allocation) {
        const tCoords = trainerCoordsMap.get(allocation.trainerId)
        if (tCoords) {
          // Find how many clients this trainer has to distribute angles
          const trainerClients = tempLinks.filter(l => l.trainerId === allocation.trainerId)
          const clientIndex = trainerClients.findIndex(l => l.clientId === c.id)
          const angle = (2 * Math.PI * clientIndex) / (trainerClients.length || 1)
          const radius = 120 // orbit radius

          c.x = tCoords.x + Math.cos(angle) * radius
          c.y = tCoords.y + Math.sin(angle) * radius
          return
        }
      }
      
      // Default fallback coordinates if unallocated
      c.x = Math.random() * (width - 100) + 50
      c.y = Math.random() * (height - 100) + 50
    })

    setNodes(tempNodes)
    setLinks(tempLinks)
  }, [allocations])

  // Pan actions
  const handleBgMouseDown = (e: React.MouseEvent) => {
    // Check if clicking background, not a node
    if ((e.target as SVGElement).tagName === 'svg' || (e.target as SVGElement).id === 'grid-bg') {
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleBgMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    } else if (draggingNodeId) {
      // Dragging node
      const rect = e.currentTarget.getBoundingClientRect()
      const mouseX = (e.clientX - rect.left - pan.x) / zoom
      const mouseY = (e.clientY - rect.top - pan.y) / zoom

      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggingNodeId
            ? { ...n, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y }
            : n
        )
      )
    }
  }

  const handleBgMouseUp = () => {
    setIsPanning(false)
    setDraggingNodeId(null)
  }

  // Node drag actions
  const handleNodeMouseDown = (e: React.MouseEvent, node: Node) => {
    e.stopPropagation()
    setDraggingNodeId(node.id)
    
    // Calculate mouse click offset relative to node center
    const rect = e.currentTarget.parentElement?.getBoundingClientRect()
    if (rect) {
      const mouseX = (e.clientX - rect.left - pan.x) / zoom
      const mouseY = (e.clientY - rect.top - pan.y) / zoom
      setDragOffset({
        x: mouseX - node.x,
        y: mouseY - node.y,
      })
    }
    setSelectedNode(node)
    if (onSelectNode) onSelectNode(node)
  }

  // Zoom controls
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2.5))
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.4))
  const resetViewport = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelectedNode(null)
  }

  // Delete Allocation Link
  const handleDisconnect = (linkId: string) => {
    if (window.confirm('Disconnect this trainer allocation?')) {
      deleteAllocationMutation.mutate(linkId, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Coaching connection terminated', variant: 'success' })
          setSelectedNode(null)
        },
        onError: (err: any) => {
          toast({ title: 'Error', description: err.message || 'Failed to disconnect', variant: 'error' })
        },
      })
    }
  }

  return (
    <div 
      ref={canvasContainerRef}
      className="relative w-full h-[580px] rounded-2xl border border-border/40 bg-card/25 backdrop-blur-md overflow-hidden shadow-2xl"
    >
      {/* Node linking animation CSS style */}
      <style>{`
        @keyframes pulseLink {
          to { stroke-dashoffset: -20; }
        }
        .network-link-active {
          animation: pulseLink 1.2s linear infinite;
        }
      `}</style>

      {/* SVG Canvas Workspace */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleBgMouseDown}
        onMouseMove={handleBgMouseMove}
        onMouseUp={handleBgMouseUp}
        onMouseLeave={handleBgMouseUp}
      >
        <defs>
          {/* Subtle grid background pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--grid-line)" strokeWidth="1" />
          </pattern>
          {/* Circular crop mask for node avatars */}
          <clipPath id="avatar-clip">
            <circle cx="0" cy="0" r="24" />
          </clipPath>
          <clipPath id="avatar-clip-client">
            <circle cx="0" cy="0" r="18" />
          </clipPath>
        </defs>

        {/* Grid Background Layer */}
        <rect id="grid-bg" width="100%" height="100%" fill="url(#grid)" />

        {/* Zoomed/Paged Group Layer */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Network Link Vector Lines */}
          {links.map((link) => {
            const trainer = nodes.find(n => n.id === link.trainerId)
            const client = nodes.find(n => n.id === link.clientId)

            if (!trainer || !client) return null

            // Draw a curved SVG quadratic path linking trainer to client
            const midX = (trainer.x + client.x) / 2
            const midY = (trainer.y + client.y) / 2 - 25 // curve factor
            const pathData = `M ${trainer.x} ${trainer.y} Q ${midX} ${midY} ${client.x} ${client.y}`

            const isSelected = selectedNode?.id === trainer.id || selectedNode?.id === client.id

            return (
              <g key={link.id} className="group">
                {/* Thick invisible click-target line */}
                <path
                  d={pathData}
                  stroke="transparent"
                  strokeWidth="15"
                  fill="none"
                  className="cursor-pointer"
                  onClick={() => handleDisconnect(link.id)}
                />
                {/* Glowing glow-shadow path line */}
                <path
                  d={pathData}
                  stroke={isSelected ? "var(--color-primary)" : "rgba(99, 102, 241, 0.2)"}
                  strokeWidth={isSelected ? "3" : "1.5"}
                  fill="none"
                  className={cn(
                    "transition-all duration-300 pointer-events-none",
                    isSelected && "network-link-active"
                  )}
                  strokeDasharray={isSelected ? "6 4" : undefined}
                />
              </g>
            )
          })}

          {/* Node SVG Groups */}
          {nodes.map((node) => {
            const isTrainer = node.role === 'TRAINER'
            const nodeSize = isTrainer ? 24 : 18
            const isSelected = selectedNode?.id === node.id

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
              >
                {/* Glowing radial outer shadow circle */}
                <circle
                  cx="0"
                  cy="0"
                  r={nodeSize + (isTrainer ? 6 : 4)}
                  fill="none"
                  stroke={
                    isTrainer 
                      ? "var(--color-primary)" 
                      : node.status === 'ACTIVE' ? "var(--color-accent)" : "rgba(156, 163, 175, 0.5)"
                  }
                  strokeWidth="2.5"
                  className={cn(
                    "transition-all duration-300 opacity-60 group-hover:opacity-100",
                    isSelected && "scale-110 opacity-100 ring-4 ring-primary/20",
                    isTrainer ? "shadow-primary/40 shadow-lg" : "shadow-accent/40 shadow-lg"
                  )}
                />

                {/* Translucent overlay circle */}
                <circle cx="0" cy="0" r={nodeSize} fill="var(--color-card)" className="transition-transform group-hover:scale-105" />

                {/* Avatar Image clip */}
                {node.avatarUrl ? (
                  <image
                    href={node.avatarUrl}
                    x={-nodeSize}
                    y={-nodeSize}
                    width={nodeSize * 2}
                    height={nodeSize * 2}
                    clipPath={isTrainer ? "url(#avatar-clip)" : "url(#avatar-clip-client)"}
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  // Fallback vector letters
                  <g className="pointer-events-none">
                    <circle cx="0" cy="0" r={nodeSize} fill={isTrainer ? "rgba(139, 92, 246, 0.2)" : "rgba(6, 182, 212, 0.2)"} />
                    <text
                      textAnchor="middle"
                      dy={isTrainer ? "5" : "4"}
                      className={cn(
                        "font-bold select-none fill-foreground",
                        isTrainer ? "text-sm" : "text-xs"
                      )}
                    >
                      {node.name.slice(0, 1)}
                    </text>
                  </g>
                )}

                {/* Text Label Backdrop box (to prevent text clashing with lines) */}
                <rect
                  x="-70"
                  y={nodeSize + 6}
                  width="140"
                  height="30"
                  fill="var(--node-backdrop)"
                  rx="6"
                  className="backdrop-blur-sm stroke-border/20 stroke"
                />

                {/* Node Name Text */}
                <text
                  y={nodeSize + 18}
                  textAnchor="middle"
                  className="text-[10px] font-semibold fill-foreground select-none pointer-events-none"
                >
                  {node.name}
                </text>
                <text
                  y={nodeSize + 28}
                  textAnchor="middle"
                  className="text-[8px] fill-muted-foreground select-none pointer-events-none capitalize"
                >
                  {isTrainer ? (node.specialization || 'Coaching') : 'Client'}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Floating Canvas Controls Overlay */}
      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 p-1 bg-card/65 border border-border/40 backdrop-blur-md rounded-xl shadow-lg">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={zoomIn} title="Zoom In">
          <ZoomIn className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={zoomOut} title="Zoom Out">
          <ZoomOut className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={resetViewport} title="Reset View">
          <Maximize2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Button>
      </div>

      {/* Active Node Info Detail Panel overlay */}
      {selectedNode && (
        <div className="absolute top-4 left-4 w-64 p-4 rounded-xl border border-border/50 bg-[#070b19]/90 backdrop-blur-md shadow-xl animate-slide-in-left">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Node Details</h4>
            <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-muted/50 rounded-full" onClick={() => setSelectedNode(null)}>
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Avatar fallback={selectedNode.name} size="sm" src={selectedNode.avatarUrl} />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{selectedNode.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{selectedNode.email}</p>
            </div>
          </div>
          <div className="space-y-1.5 text-[10px] text-muted-foreground pt-2 border-t border-border/40">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-semibold text-foreground capitalize">{selectedNode.role.toLowerCase()}</span>
            </div>
            {selectedNode.role === 'TRAINER' ? (
              <div className="flex justify-between">
                <span>Specialty:</span>
                <span className="font-semibold text-primary">{selectedNode.specialization || 'Weight Training'}</span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={cn(
                  "font-semibold",
                  selectedNode.status === 'ACTIVE' ? "text-emerald-400" : "text-rose-400"
                )}>{selectedNode.status || 'Active'}</span>
              </div>
            )}
            <p className="text-[8px] text-muted-foreground/60 italic mt-2">
              Tip: Click on connection paths to sever allocations.
            </p>
          </div>
        </div>
      )}

      {/* Empty State Overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 p-6 bg-[#030712]/50">
          <Dumbbell className="h-10 w-10 text-muted-foreground/40 animate-bounce" />
          <p className="text-sm text-muted-foreground">No coaching connection network records found</p>
        </div>
      )}
    </div>
  )
}
