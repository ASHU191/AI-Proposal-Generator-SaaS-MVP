"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft, Loader2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "password") {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }

    setPasswordChecks(checks)

    const strength = Object.values(checks).filter(Boolean).length
    setPasswordStrength(strength)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    if (passwordStrength < 3) {
      toast({
        title: "Weak password",
        description: "Please choose a stronger password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userExists = users.some((user: any) => user.email === formData.email)

    if (userExists) {
      toast({
        title: "User already exists",
        description: "This email is already registered. Please login instead.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Create new user
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password, // In a real app, this would be hashed
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      localStorage.setItem("users", JSON.stringify([...users, newUser]))

      // Auto login
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      toast({
        title: "Account created!",
        description: "Welcome to ProposalAI!",
      })

      router.push("/dashboard")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Background blobs */}
      <div className="blob w-[400px] h-[400px] bg-primary/20 top-[-100px] right-[-100px]"></div>
      <div className="blob w-[500px] h-[500px] bg-accent/20 bottom-[-200px] left-[-200px]"></div>

      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-8"
      >
        <div className="relative">
          <FileText className="h-8 w-8 text-primary" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10"></div>
        </div>
        <span className="font-bold text-2xl">ProposalAI</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-lg gradient-border">
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Sign up to start creating AI-powered proposals</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pr-10 transition-all duration-300 focus:border-primary"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              level <= passwordStrength
                                ? level <= 2
                                  ? "bg-red-500"
                                  : level <= 4
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1">
                          {passwordChecks.length ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordChecks.length ? "text-green-500" : "text-muted-foreground"}>
                            At least 8 characters
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {passwordChecks.uppercase ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordChecks.uppercase ? "text-green-500" : "text-muted-foreground"}>
                            Uppercase letter
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {passwordChecks.lowercase ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordChecks.lowercase ? "text-green-500" : "text-muted-foreground"}>
                            Lowercase letter
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {passwordChecks.number ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                          <span className={passwordChecks.number ? "text-green-500" : "text-muted-foreground"}>
                            Number
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="transition-all duration-300 focus:border-primary"
                  />
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full relative overflow-hidden group shine-effect" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Create Account</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
                  </>
                )}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
