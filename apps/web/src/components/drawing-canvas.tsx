"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

type Point = {
    x: number
    y: number
    color: string
    size: number
}

type Line = {
    points: Point[]
    color: string
    size: number
}

const COLORS = [
    "#000000", // Black
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
]

const BRUSH_SIZES = [2, 5, 10, 15]

export default function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const canvasContainerRef = useRef<HTMLDivElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [lines, setLines] = useState<Line[]>([])
    const [currentLine, setCurrentLine] = useState<Point[]>([])
    const [currentColor, setCurrentColor] = useState(COLORS[0])
    const [currentSize, setCurrentSize] = useState(BRUSH_SIZES[1])
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 500, height: 300 })

    // Simulated collaborative cursors
    const [collaborators, setCollaborators] = useState([
        { id: 1, x: 100, y: 100, color: "#FF0000", name: "User A" },
        { id: 2, x: 200, y: 150, color: "#00FF00", name: "User B" },
    ])

    // Set canvas dimensions based on container
    useEffect(() => {
        const resizeCanvas = () => {
            if (canvasContainerRef.current && canvasRef.current) {
                const container = canvasContainerRef.current
                const canvas = canvasRef.current

                // Keep the internal canvas dimensions fixed
                const fixedWidth = 500
                const fixedHeight = 300

                setCanvasDimensions({
                    width: fixedWidth,
                    height: fixedHeight
                })

                // Set the display size based on container
                canvas.style.width = '100%'
                canvas.style.height = 'auto'

                // Set the actual canvas dimensions
                canvas.width = fixedWidth
                canvas.height = fixedHeight
            }
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        return () => {
            window.removeEventListener('resize', resizeCanvas)
        }
    }, [])

    // Animation for collaborators
    useEffect(() => {
        const interval = setInterval(() => {
            setCollaborators((prev) =>
                prev.map((collab) => ({
                    ...collab,
                    x: collab.x + (Math.random() * 10 - 5),
                    y: collab.y + (Math.random() * 10 - 5),
                })),
            )
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // Draw on canvas
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw all lines
        lines.forEach((line) => {
            if (line.points.length < 2) return

            ctx.beginPath()
            ctx.moveTo(line.points[0].x, line.points[0].y)

            for (let i = 1; i < line.points.length; i++) {
                ctx.lineTo(line.points[i].x, line.points[i].y)
            }

            ctx.strokeStyle = line.color
            ctx.lineWidth = line.size
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            ctx.stroke()
        })

        // Draw current line
        if (currentLine.length > 1) {
            ctx.beginPath()
            ctx.moveTo(currentLine[0].x, currentLine[0].y)

            for (let i = 1; i < currentLine.length; i++) {
                ctx.lineTo(currentLine[i].x, currentLine[i].y)
            }

            ctx.strokeStyle = currentColor
            ctx.lineWidth = currentSize
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            ctx.stroke()
        }

        // Draw collaborator cursors
        collaborators.forEach((collab) => {
            ctx.beginPath()
            ctx.fillStyle = collab.color
            ctx.arc(collab.x, collab.y, 5, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = "#000"
            ctx.font = "10px Arial"
            ctx.fillText(collab.name, collab.x + 10, collab.y - 10)
        })
    }, [lines, currentLine, collaborators, currentColor, currentSize])

    // Get accurate canvas coordinates from mouse/touch events
    const getCanvasCoordinates = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }

        const rect = canvas.getBoundingClientRect()

        // Calculate the scaling factor between displayed size and actual canvas size
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        // Apply the scaling to get accurate coordinates
        const x = (clientX - rect.left) * scaleX
        const y = (clientY - rect.top) * scaleY

        return { x, y }
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const { x, y } = getCanvasCoordinates(e.clientX, e.clientY)
        setCurrentLine([{ x, y, color: currentColor, size: currentSize }])
        setIsDrawing(true)
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        const { x, y } = getCanvasCoordinates(e.clientX, e.clientY)
        setCurrentLine((prev) => [...prev, { x, y, color: currentColor, size: currentSize }])
    }

    const stopDrawing = () => {
        if (!isDrawing) return

        if (currentLine.length > 0) {
            setLines((prev) => [
                ...prev,
                {
                    points: currentLine,
                    color: currentColor,
                    size: currentSize,
                },
            ])
        }

        setCurrentLine([])
        setIsDrawing(false)
    }

    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        const touch = e.touches[0]
        const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY)

        setCurrentLine([{ x, y, color: currentColor, size: currentSize }])
        setIsDrawing(true)
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        const touch = e.touches[0]
        const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY)

        setCurrentLine((prev) => [...prev, { x, y, color: currentColor, size: currentSize }])
    }

    const handleTouchEnd = () => {
        stopDrawing()
    }

    const clearCanvas = () => {
        setLines([])
        setCurrentLine([])
    }

    return (
        <div className="flex flex-col">
            <div className="p-2 flex justify-between items-center bg-muted/30">
                <div className="flex space-x-1">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            className={`w-6 h-6 rounded-full ${currentColor === color ? "ring-2 ring-primary ring-offset-2" : ""}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setCurrentColor(color)}
                            aria-label={`Select ${color} color`}
                        />
                    ))}
                </div>

                <div className="flex space-x-1">
                    {BRUSH_SIZES.map((size) => (
                        <button
                            key={size}
                            className={`w-8 h-8 rounded-full flex items-center justify-center bg-background border ${currentSize === size ? "border-primary" : "border-border"}`}
                            onClick={() => setCurrentSize(size)}
                            aria-label={`Select brush size ${size}`}
                        >
                            <div className="rounded-full bg-foreground" style={{ width: size, height: size }} />
                        </button>
                    ))}
                </div>

                <button className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded" onClick={clearCanvas}>
                    Clear
                </button>
            </div>

            <div ref={canvasContainerRef} className="relative border-t border-border">
                <canvas
                    ref={canvasRef}
                    width={canvasDimensions.width}
                    height={canvasDimensions.height}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="w-full touch-none cursor-crosshair"
                />

                {/* Animated drawing hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <p className="text-sm text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
                        Click and drag to draw
                    </p>
                </motion.div>
            </div>
        </div>
    )
}