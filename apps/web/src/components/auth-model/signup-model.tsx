"use client"

import type React from "react"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { client } from "@/utils/http-client"

interface SignupModalProps {
    isOpen: boolean
    onClose: () => void
    onLoginClick: () => void
}

export default function SignupModal({ isOpen, onClose, onLoginClick }: SignupModalProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await client.post("/signup", {
                name,
                username: email,
                password,
            });

            setSuccess(true);

            setTimeout(() => {
                resetForm();
                onLoginClick();
            }, 2000);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    // Handle specific error status codes
                    if (err.response.status === 401) {
                        setError(err.response.data.message || "User already exists. Please log in instead.");
                    } else {
                        setError("An error occurred during signup. Please try again.");
                    }
                } else if (err.code === "ERR_NETWORK") {
                    setError("Network error. CORS issue or server might be down. Please check your backend configuration.");
                } else {
                    setError("Network error. Please check your connection and try again.");
                }
            } else {
                setError("Unexpected error occurred. Please try again.");
            }
            console.error("Signup error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName("")
        setEmail("")
        setPassword("")
        setAgreeTerms(false)
        setError(null)
        setSuccess(false)
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
                            onClick={() => {
                                resetForm()
                                onClose()
                            }}
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>

                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Create an account</h2>
                            <p className="text-sm text-muted-foreground mt-1">Join CollabCanvas and start creating together</p>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                                <AlertDescription className="text-green-800">
                                    Account created successfully! Redirecting to login...
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading || success}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading || success}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input
                                    id="signup-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading || success}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={agreeTerms}
                                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                                    disabled={isLoading || success}
                                    required
                                />
                                <Label htmlFor="terms" className="text-sm">
                                    I agree to the{" "}
                                    <Button variant="link" className="p-0 h-auto">
                                        Terms of Service
                                    </Button>{" "}
                                    and{" "}
                                    <Button variant="link" className="p-0 h-auto">
                                        Privacy Policy
                                    </Button>
                                </Label>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading || success || !agreeTerms}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : success ? (
                                    "Account Created!"
                                ) : (
                                    "Sign up"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <p className="text-muted-foreground">
                                Already have an account?{" "}
                                <Button
                                    variant="link"
                                    className="p-0 h-auto"
                                    onClick={() => {
                                        resetForm()
                                        onLoginClick()
                                    }}
                                    disabled={isLoading}
                                >
                                    Log in
                                </Button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

