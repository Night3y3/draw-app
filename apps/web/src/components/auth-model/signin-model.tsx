"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { client } from "@/utils/http-client"
import useAuthStore from "@repo/store/auth"
import useUserStore from "@repo/store/user"

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
    onSignupClick: () => void
}

export default function LoginModal({ isOpen, onClose, onSignupClick }: LoginModalProps) {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const addAccessToken = useAuthStore((state) => state.addAccessToken);
    const addUserData = useUserStore((state) => state.setUserData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const response = await client.post("/login", {
                username: email,
                password,
            })

            addAccessToken(response.data.token)
            addUserData({
                id: response.data.id,
                email: response.data.email,
                name: response.data.name,
                photo: response.data.photo,
            })

            router.push("/dashboard")
            onClose()
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                // Handle specific error status codes
                if (err.response.status === 404) {
                    setError(err.response.data.message || "Username or password is incorrect")
                } else {
                    setError("An error occurred during login. Please try again.")
                }
            } else {
                setError("Network error. Please check your connection and try again.")
            }
            console.error("Login error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative bg-background rounded-lg shadow-lg border border-border max-w-md w-full p-6"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>

                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Welcome back</h2>
                            <p className="text-sm text-muted-foreground mt-1">Log in to your CollabCanvas account</p>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Button variant="link" size="sm" className="p-0 h-auto">
                                        Forgot password?
                                    </Button>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember-me"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    disabled={isLoading}
                                />
                                <Label htmlFor="remember-me" className="text-sm">
                                    Remember me
                                </Label>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    "Log in"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <p className="text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Button variant="link" className="p-0 h-auto" onClick={onSignupClick} disabled={isLoading}>
                                    Sign up
                                </Button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

