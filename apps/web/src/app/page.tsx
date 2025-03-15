"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Paintbrush, Users, Share2, Zap, ChevronRight, Menu, X, Download, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import LoginModal from "@/components/auth-model/signin-model"
import SignupModal from "@/components/auth-model/signup-model"
import DrawingCanvas from "@/components/drawing-canvas"


export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const [heroRef, heroInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const featureItems = [
    {
      icon: <Paintbrush className="h-10 w-10 text-primary" />,
      title: "Intuitive Drawing Tools",
      description: "Access a wide range of brushes, colors, and tools designed for both beginners and professionals.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Real-time Collaboration",
      description: "Draw together with teammates in real-time, no matter where they are in the world.",
    },
    {
      icon: <Share2 className="h-10 w-10 text-primary" />,
      title: "Easy Sharing",
      description: "Share your creations instantly with customizable privacy settings.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Lightning Fast",
      description: "Optimized performance ensures smooth drawing experience even with multiple collaborators.",
    },
    {
      icon: <Download className="h-10 w-10 text-primary" />,
      title: "Export Options",
      description: "Export your artwork in multiple formats including PNG, SVG, and PDF.",
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: "Layer Support",
      description: "Organize your artwork with powerful layer management tools.",
    },
  ]

  // Handle modal switching
  const openLoginFromSignup = () => {
    setIsSignupOpen(false)
    setTimeout(() => setIsLoginOpen(true), 100) // Small delay for better animation
  }

  const openSignupFromLogin = () => {
    setIsLoginOpen(false)
    setTimeout(() => setIsSignupOpen(true), 100) // Small delay for better animation
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={cn(
          "fixed w-full z-50 transition-all duration-300",
          scrollY > 50 ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} transition={{ duration: 0.5 }}>
              <Paintbrush className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="font-bold text-xl">CollabCanvas</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {featureItems.slice(0, 4).map((item, index) => (
                        <li key={index}>
                          <NavigationMenuLink asChild>
                            <a
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href="#features"
                            >
                              <div className="flex items-center space-x-2">
                                {item.icon}
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="#pricing" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="#about" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setIsLoginOpen(true)} className="transition-all hover:scale-105">
                Log in
              </Button>
              <Button onClick={() => setIsSignupOpen(true)} className="transition-all hover:scale-105">
                Sign up
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background border-b"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="#features"
                className="px-4 py-2 hover:bg-accent rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="px-4 py-2 hover:bg-accent rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="px-4 py-2 hover:bg-accent rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLoginOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Log in
                </Button>
                <Button
                  onClick={() => {
                    setIsSignupOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Sign up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
          <div ref={heroRef} className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
                Collaborative Drawing Reimagined
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Create Together, <br />
                <span className="text-primary">Draw Without Limits</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Experience real-time collaborative drawing that brings teams together. Create, share, and collaborate on
                digital canvases from anywhere in the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" onClick={() => setIsSignupOpen(true)} className="group">
                  Start Drawing Now
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" as={Link} href="#features">
                  Explore Features
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-primary/80 border-2 border-background flex items-center justify-center text-xs text-white font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p>Join 10,000+ artists and teams</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10 bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="h-8 bg-gray-100 dark:bg-gray-800 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <DrawingCanvas />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
            </motion.div>
          </div>

          {/* Background decorations */}
          <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-r from-primary/5 to-secondary/5 -skew-y-3 -z-10"></div>
        </section>

        {/* Features Section */}
        <section id="features" ref={featuresRef} className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Creative Collaboration</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to bring your creative vision to life with your team
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureItems.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-background rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg inline-block">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How CollabCanvas Works</h2>
              <p className="text-lg text-muted-foreground">
                Simple, intuitive, and powerful - start collaborating in minutes
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-border hidden md:block"></div>

              {[
                {
                  title: "Create a Canvas",
                  description: "Start with a blank canvas or choose from our templates to kickstart your project.",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  title: "Invite Collaborators",
                  description: "Share a simple link to invite team members to join your canvas in real-time.",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  title: "Draw Together",
                  description: "Collaborate in real-time with intuitive drawing tools and see changes instantly.",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  title: "Export & Share",
                  description: "Export your finished artwork in multiple formats or share directly to social media.",
                  image: "/placeholder.svg?height=200&width=300",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className={`relative md:grid md:grid-cols-2 gap-8 items-center mb-16 ${index % 2 === 1 ? "md:rtl" : ""
                    }`}
                >
                  <div className={`md:text-${index % 2 === 1 ? "left" : "right"} md:ltr`}>
                    <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary text-white items-center justify-center font-bold text-xl z-10">
                      {index + 1}
                    </div>
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="bg-background rounded-xl p-6 shadow-sm border border-border"
                    >
                      <h3 className="text-xl font-semibold mb-2 flex md:hidden items-center">
                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mr-2">
                          {index + 1}
                        </span>
                        {step.title}
                      </h3>
                      <h3 className="text-xl font-semibold mb-2 hidden md:block">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:ltr"
                  >
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      width={600}
                      height={400}
                      className="rounded-xl shadow-md border border-border"
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" ref={ctaRef} className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10"></div>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center bg-background rounded-2xl p-8 md:p-12 shadow-xl border border-border relative z-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Creative Collaboration?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of teams and artists who are already creating amazing work together on CollabCanvas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => setIsSignupOpen(true)} className="group">
                  Get Started for Free
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg">
                  Schedule a Demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">No credit card required. Free plan available.</p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Paintbrush className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">CollabCanvas</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Bringing creative teams together through collaborative drawing.
              </p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "github"].map((social) => (
                  <Link
                    key={social}
                    href={`#${social}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border">
                      {/* Placeholder for social icons */}
                      {social[0].toUpperCase()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Tutorials", "Blog", "Support", "Community"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Contact", "Privacy Policy", "Terms of Service"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link
                        href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CollabCanvas. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSignupClick={openSignupFromLogin} />

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} onLoginClick={openLoginFromSignup} />
    </div>
  )
}

