"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Paintbrush, ArrowLeft, Plus, LogIn, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useAuthStore from "@repo/store/auth"
import useWebSocketStore from "@repo/store/ws"
import { WS_URL } from "@/config";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import ProfileDropdown from "./profile-dropdown"

export default function Dashboard() {
    const router = useRouter()
    const [view, setView] = useState<"main" | "create" | "join">("main")
    const [roomName, setRoomName] = useState("")
    const [roomCode, setRoomCode] = useState("")
    const [copied, setCopied] = useState(false)
    const [createdRoomCode, setCreatedRoomCode] = useState("")
    const accessToken = useAuthStore((state) => state.accessToken);
    const addWS = useWebSocketStore((state) => state.setWs);

    // Generate a random room code when creating a room
    const generateRoomCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${accessToken}`)
        addWS(ws)
    })

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault()
        if (!roomName) return

        // Generate a room code
        const newRoomCode = generateRoomCode()
        setCreatedRoomCode(newRoomCode)

        // In a real app, you would save this to a database
        console.log("Creating room:", roomName, "with code:", newRoomCode)

        // Simulate redirect to the room
        // router.push(`/room/${newRoomCode}`)
    }

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault()
        if (!roomCode) return

        // In a real app, you would validate this code against a database
        console.log("Joining room with code:", roomCode)

        // Simulate redirect to the room
        // router.push(`/room/${roomCode}`)
    }

    const copyRoomCode = () => {
        navigator.clipboard.writeText(createdRoomCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            transition: { when: "afterChildren" },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
        exit: { y: -20, opacity: 0 },
    }

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        }),
    }

    // Direction for animations
    const getDirection = (newView: string) => {
        if (view === "main") return 1
        if (newView === "main") return -1
        return 0
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex flex-col">
            <header className="w-full py-4 px-6 flex items-center justify-between border-b">
                <Link href="/" className="flex items-center space-x-2">
                    <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} transition={{ duration: 0.5 }}>
                        <Paintbrush className="h-6 w-6 text-primary" />
                    </motion.div>
                    <span className="font-bold text-xl">CollabCanvas</span>
                </Link>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                        Help
                    </Button>
                    <Button variant="ghost" size="sm">
                        Settings
                    </Button>
                    <ProfileDropdown />
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto">
                    <AnimatePresence mode="wait" custom={getDirection(view)}>
                        {view === "main" && (
                            <motion.div
                                key="main"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                custom={getDirection("main")}
                                className="bg-background border border-border rounded-xl shadow-lg overflow-hidden"
                            >
                                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6">
                                    <motion.div variants={itemVariants} className="text-center mb-8">
                                        <h1 className="text-2xl font-bold mb-2">Welcome to CollabCanvas</h1>
                                        <p className="text-muted-foreground">Start drawing with friends or colleagues</p>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="space-y-4">
                                        <Button
                                            onClick={() => setView("create")}
                                            className="w-full h-16 text-lg group relative overflow-hidden"
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-primary-foreground/10 rounded-md"
                                                initial={{ scale: 0, opacity: 0 }}
                                                whileHover={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                            />
                                            <span className="flex items-center justify-center gap-2">
                                                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                                                Create Room
                                            </span>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => setView("join")}
                                            className="w-full h-16 text-lg group relative overflow-hidden"
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-primary/10 rounded-md"
                                                initial={{ scale: 0, opacity: 0 }}
                                                whileHover={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                            />
                                            <span className="flex items-center justify-center gap-2">
                                                <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                                Join Room
                                            </span>
                                        </Button>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="mt-8 text-center">
                                        <p className="text-sm text-muted-foreground">Recent rooms will appear here</p>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}

                        {view === "create" && (
                            <motion.div
                                key="create"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                custom={getDirection("create")}
                                className="bg-background border border-border rounded-xl shadow-lg overflow-hidden"
                            >
                                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6">
                                    <motion.div variants={itemVariants} className="flex items-center mb-6">
                                        <Button variant="ghost" size="icon" onClick={() => setView("main")} className="mr-2 group">
                                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                                            <span className="sr-only">Back</span>
                                        </Button>
                                        <h2 className="text-xl font-bold">Create a New Room</h2>
                                    </motion.div>

                                    {!createdRoomCode ? (
                                        <motion.form variants={itemVariants} onSubmit={handleCreateRoom} className="space-y-4">
                                            <div className="space-y-2">
                                                <label htmlFor="room-name" className="text-sm font-medium">
                                                    Room Name
                                                </label>
                                                <Input
                                                    id="room-name"
                                                    placeholder="My Awesome Drawing Room"
                                                    value={roomName}
                                                    onChange={(e) => setRoomName(e.target.value)}
                                                    className="h-12"
                                                    required
                                                />
                                            </div>

                                            <Button type="submit" className="w-full h-12 text-lg" disabled={!roomName}>
                                                Create Room
                                            </Button>
                                        </motion.form>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-center space-y-2">
                                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
                                                    <Check className="h-8 w-8" />
                                                </div>
                                                <h3 className="text-xl font-bold">Room Created!</h3>
                                                <p className="text-muted-foreground">Share this code with others to invite them</p>
                                            </div>

                                            <div className="relative">
                                                <Input value={createdRoomCode} readOnly className="h-12 text-center text-lg font-mono pr-12" />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-1 top-1 bottom-1"
                                                    onClick={copyRoomCode}
                                                >
                                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                    <span className="sr-only">Copy code</span>
                                                </Button>
                                            </div>

                                            <div className="flex gap-4">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={() => {
                                                        setCreatedRoomCode("")
                                                        setRoomName("")
                                                        setView("main")
                                                    }}
                                                >
                                                    Back to Dashboard
                                                </Button>
                                                <Button className="flex-1">Enter Room</Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}

                        {view === "join" && (
                            <motion.div
                                key="join"
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                custom={getDirection("join")}
                                className="bg-background border border-border rounded-xl shadow-lg overflow-hidden"
                            >
                                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6">
                                    <motion.div variants={itemVariants} className="flex items-center mb-6">
                                        <Button variant="ghost" size="icon" onClick={() => setView("main")} className="mr-2 group">
                                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                                            <span className="sr-only">Back</span>
                                        </Button>
                                        <h2 className="text-xl font-bold">Join a Room</h2>
                                    </motion.div>

                                    <motion.form variants={itemVariants} onSubmit={handleJoinRoom} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="room-code" className="text-sm font-medium">
                                                Room Code
                                            </label>
                                            <Input
                                                id="room-code"
                                                placeholder="Enter 6-digit code (e.g., AB12CD)"
                                                value={roomCode}
                                                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                                className="h-12 text-center text-lg font-mono uppercase"
                                                maxLength={6}
                                                required
                                            />
                                        </div>

                                        <Button type="submit" className="w-full h-12 text-lg" disabled={roomCode.length < 6}>
                                            Join Room
                                        </Button>
                                    </motion.form>

                                    <motion.div variants={itemVariants} className="mt-8">
                                        <h3 className="text-sm font-medium mb-2">Recently Joined</h3>
                                        <div className="space-y-2">
                                            {["ABCDEF", "XYZ123"].map((code) => (
                                                <motion.div
                                                    key={code}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="p-3 border border-border rounded-lg flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors"
                                                    onClick={() => {
                                                        setRoomCode(code)
                                                        handleJoinRoom(new Event("submit") as any)
                                                    }}
                                                >
                                                    <div>
                                                        <p className="font-mono font-medium">{code}</p>
                                                        <p className="text-xs text-muted-foreground">Last joined 2 days ago</p>
                                                    </div>
                                                    <LogIn className="h-4 w-4 text-muted-foreground" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <footer className="border-t py-4 px-6">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} CollabCanvas</p>
                    <div className="flex space-x-4">
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Help
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Privacy
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

