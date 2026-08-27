'use client'
import React, { useEffect, useRef, useState } from 'react'

interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color1: string
  color2: string
}

interface EnergyRing {
  x: number
  y: number
  radius: number
  maxRadius: number
  speed: number
  hue: number
  lineWidth: number
  opacity: number
}

interface Spark {
  x: number
  y: number
  vy: number
  radius: number
  color: string
  alpha: number
  seed: number
}

export function FuturisticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 })
  const [scrollPosition, setScrollPosition] = useState(0)

  // Track mouse and scroll coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    // Setup Liquid Aurora Garden Blobs
    // Vibrant colors from the Energy Flow palette
    const blobs: Blob[] = [
      {
        x: canvas.width * 0.15,
        y: canvas.height * 0.25,
        vx: 0.15,
        vy: 0.1,
        radius: 280,
        color1: 'rgba(232, 232, 64, 0.08)', // Electric Lime
        color2: 'rgba(232, 232, 64, 0.0)',
      },
      {
        x: canvas.width * 0.85,
        y: canvas.height * 0.15,
        vx: -0.1,
        vy: 0.15,
        radius: 320,
        color1: 'rgba(184, 184, 216, 0.10)', // Lavender Mist
        color2: 'rgba(184, 184, 216, 0.0)',
      },
      {
        x: canvas.width * 0.5,
        y: canvas.height * 0.7,
        vx: 0.08,
        vy: -0.12,
        radius: 300,
        color1: 'rgba(232, 232, 64, 0.07)', // Electric Lime
        color2: 'rgba(232, 232, 64, 0.0)',
      },
      {
        x: canvas.width * 0.75,
        y: canvas.height * 0.8,
        vx: -0.12,
        vy: -0.08,
        radius: 260,
        color1: 'rgba(184, 184, 216, 0.09)', // Lavender Mist
        color2: 'rgba(184, 184, 216, 0.0)',
      },
      {
        x: canvas.width * 0.3,
        y: canvas.height * 0.6,
        vx: 0.1,
        vy: 0.12,
        radius: 250,
        color1: 'rgba(232, 232, 64, 0.06)', // Electric Lime
        color2: 'rgba(232, 232, 64, 0.0)',
      },
      {
        x: canvas.width * 0.9,
        y: canvas.height * 0.5,
        vx: -0.15,
        vy: -0.1,
        radius: 270,
        color1: 'rgba(184, 184, 216, 0.08)', // Lavender Mist
        color2: 'rgba(184, 184, 216, 0.0)',
      }
    ]

    // Fitness Energy Rings array
    let rings: EnergyRing[] = []

    // Energy Sparks (upward floating fireflies)
    let sparks: Spark[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Re-seed sparks based on dimensions
      sparks = []
      const sparkCount = Math.min(30, Math.floor((canvas.width * canvas.height) / 50000))
      for (let i = 0; i < sparkCount; i++) {
        sparks.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vy: Math.random() * 0.25 + 0.1,
          radius: Math.random() * 1.5 + 0.5,
          color: getRandomSparkColor(),
          alpha: Math.random() * 0.5 + 0.2,
          seed: Math.random() * 100,
        })
      }
    }

    const getRandomSparkColor = (): string => {
      const colors = [
        'rgba(232, 232, 64, 0.45)', // Electric Lime
        'rgba(184, 184, 216, 0.45)', // Lavender Mist
        'rgba(240, 240, 240, 0.45)', // White Smoke
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    // Helper to draw flowing aurora wave ribbons
    const drawAuroraRibbon = (
      offsetY: number,
      amplitude: number,
      frequency: number,
      speed: number,
      strokeWidth: number,
      color1: string,
      color2: string
    ) => {
      ctx.beginPath()
      for (let x = 0; x <= canvas.width; x += 15) {
        const y =
          offsetY +
          Math.sin(x * frequency + time * speed) * amplitude +
          Math.sin(x * frequency * 0.45 - time * speed * 0.6) * (amplitude * 0.5)
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.lineWidth = strokeWidth
      
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
      grad.addColorStop(0, color1)
      grad.addColorStop(0.5, color2)
      grad.addColorStop(1, color1)

      ctx.strokeStyle = grad
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    const animate = () => {
      time += 0.5
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Layer 1: Soft composite background
      ctx.globalCompositeOperation = 'source-over'

      // Move and render drifting gradient blobs
      blobs.forEach((b) => {
        b.x += b.vx
        b.y += b.vy

        // Wrap around boundaries
        if (b.x < -b.radius) b.x = canvas.width + b.radius
        if (b.x > canvas.width + b.radius) b.x = -b.radius
        if (b.y < -b.radius) b.y = canvas.height + b.radius
        if (b.y > canvas.height + b.radius) b.y = -b.radius

        // Subtle mouse parallax shift
        const mouseShiftX = (mouse.x - canvas.width / 2) * 0.02
        const mouseShiftY = (mouse.y - canvas.height / 2) * 0.02
        const drawX = b.x + mouseShiftX
        const drawY = b.y + mouseShiftY

        const radial = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, b.radius)
        radial.addColorStop(0, b.color1)
        radial.addColorStop(1, b.color2)

        ctx.beginPath()
        ctx.arc(drawX, drawY, b.radius, 0, Math.PI * 2)
        ctx.fillStyle = radial
        ctx.fill()
      })

      // Layer 2: Draw flowing aurora ribbons
      drawAuroraRibbon(
        canvas.height * 0.35 - scrollPosition * 0.15,
        60,
        0.0015,
        0.006,
        140,
        'rgba(232, 232, 64, 0.03)', // Electric Lime
        'rgba(184, 184, 216, 0.04)'  // Lavender Mist
      )

      drawAuroraRibbon(
        canvas.height * 0.65 - scrollPosition * 0.2,
        80,
        0.0012,
        0.008,
        180,
        'rgba(184, 184, 216, 0.03)', // Lavender Mist
        'rgba(232, 232, 64, 0.04)'   // Electric Lime
      )

      drawAuroraRibbon(
        canvas.height * 0.5 - scrollPosition * 0.1,
        70,
        0.002,
        0.007,
        150,
        'rgba(232, 232, 64, 0.03)', // Electric Lime
        'rgba(184, 184, 216, 0.04)'   // Lavender Mist
      )

      // Layer 3: Render expanding Fitness Energy Rings
      // Spawn new energy rings periodically
      if (Math.random() < 0.006 && rings.length < 6) {
        rings.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 5,
          maxRadius: Math.random() * 250 + 150,
          speed: Math.random() * 0.4 + 0.3,
          hue: Math.random() > 0.5 ? 60 : 255,
          lineWidth: Math.random() * 1.5 + 0.5,
          opacity: 0.35,
        })
      }

      rings.forEach((r, idx) => {
        r.radius += r.speed
        r.hue = (r.hue + 0.1) % 360
        const progress = r.radius / r.maxRadius
        r.opacity = (1 - progress) * 0.35

        if (r.radius >= r.maxRadius) {
          rings.splice(idx, 1)
          return
        }

        // Draw primary ring
        ctx.beginPath()
        ctx.arc(r.x, r.y - scrollPosition * 0.1, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${r.hue}, 95%, 70%, ${r.opacity})`
        ctx.lineWidth = r.lineWidth
        ctx.stroke()

        // Draw overlapping secondary inner ring for visual depth
        if (r.radius > 40) {
          ctx.beginPath()
          ctx.arc(r.x, r.y - scrollPosition * 0.1, r.radius - 30, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(${(r.hue + 180) % 360}, 95%, 70%, ${r.opacity * 0.45})`
          ctx.lineWidth = r.lineWidth * 0.7
          ctx.stroke()
        }
      })

      // Layer 4: Render floating Energy Sparks
      sparks.forEach((s) => {
        s.y -= s.vy
        s.x += Math.sin(time * 0.03 + s.seed) * 0.25

        // If spark drifts off the top of screen, reset to bottom
        if (s.y < -10) {
          s.y = canvas.height + 10
          s.x = Math.random() * canvas.width
        }

        // Mouse reaction repulsion
        const dx = mouse.x - s.x
        const dy = (mouse.y + scrollPosition) - s.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          const force = (100 - dist) / 100
          s.x -= (dx / dist) * force * 1.2
          s.y -= (dy / dist) * force * 1.2
        }

        ctx.beginPath()
        ctx.arc(s.x, s.y - scrollPosition * 0.08, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Trigger ring spawning on mouse click
    const handleCanvasClick = (e: MouseEvent) => {
      if (rings.length > 15) return
      // Spawn energy rings radiating from cursor
      rings.push({
        x: e.clientX,
        y: e.clientY + scrollPosition,
        radius: 2,
        maxRadius: Math.random() * 200 + 200,
        speed: 0.8,
        hue: Math.random() > 0.5 ? 60 : 255,
        lineWidth: 2.0,
        opacity: 0.5,
      })
    }

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('click', handleCanvasClick)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('click', handleCanvasClick)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mouse, scrollPosition])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      {/* Mesh Grid Backdrop */}
      <div className="absolute inset-0 mesh-grid opacity-[0.06] transition-opacity duration-500 dark:opacity-[0.03]" />

      {/* Spotlight Follow Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-60"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, var(--spotlight-color), transparent 85%)`,
        }}
      />

      {/* Main Vector Rendering Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
