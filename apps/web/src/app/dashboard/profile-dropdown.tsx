"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, User } from "lucide-react"
import Link from "next/link"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProfileDropdown() {
    // In a real app, you would get this from your auth context/provider
    const [userName, setUserName] = useState("Guest User")
    const [isOpen, setIsOpen] = useState(false)

    // Get the first letter of the name for the avatar
    const firstLetter = userName.charAt(0).toUpperCase()

    // For demo purposes, set a random name on component mount
    useEffect(() => {
        const names = ["Alex Johnson", "Taylor Smith", "Jordan Williams", "Casey Brown", "Morgan Davis"]
        const randomName = names[Math.floor(Math.random() * names.length)]
        setUserName(randomName)
    }, [])

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative cursor-pointer">
                    <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary transition-colors">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">{firstLetter}</AvatarFallback>
                    </Avatar>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-primary"
                            />
                        )}
                    </AnimatePresence>
                </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {userName.toLowerCase().replace(/\s/g, "")}@example.com
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem asChild className="cursor-pointer text-destructive focus:text-destructive">
                    <Link href="/" className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

