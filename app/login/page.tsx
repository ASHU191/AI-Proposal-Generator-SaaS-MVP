"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft, Loader2, Eye, EyeOff, UserCog } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [activeTab, setActiveTab] = useState("user")

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      router.push("/dashboard")
    }

    // Create admin account if it doesn't exist
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const adminExists = users.some((u: any) => u.email === "admin@gmail.com")

    if (!adminExists) {
      const adminUser = {
        id: "admin-" + Date.now().toString(),
        name: "Admin User",
        email: "admin@gmail.com",
        password: "Aa3232107@",
        isAdmin: true,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("users", JSON.stringify([...users, adminUser]))
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) => u.email === email && u.password === password)

    setTimeout(() => {
      if (user) {
        // Store logged in user
        localStorage.setItem("currentUser", JSON.stringify(user))

        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
      }

      setIsLoading(false)
    }, 1000)
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (email !== "admin@gmail.com" || password !== "Aa3232107@") {
      toast({
        title: "Admin login failed",
        description: "Invalid admin credentials",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      // Get admin user
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const adminUser = users.find((u: any) => u.email === "admin@gmail.com")

      if (adminUser) {
        // Store logged in admin
        localStorage.setItem("currentUser", JSON.stringify(adminUser))

        toast({
          title: "Admin login successful",
          description: "Welcome to the admin dashboard!",
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "Admin login failed",
          description: "Admin account not found",
          variant: "destructive",
        })
      }

      setIsLoading(false)
    }, 1000)
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
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <FileText className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10"></div>
          </div>
          <span className="font-bold text-2xl">ProposalAI</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="user">User Login</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card className="border-border/50 shadow-lg gradient-border bg-gradient-to-br from-background to-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Login to access your proposals</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="transition-all duration-300 focus:border-primary"
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <Label htmlFor="remember" className="text-sm font-normal">
                        Remember me
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden group shine-effect"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Login</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
                      </>
                    )}
                  </Button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link href="/signup" className="text-primary hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card className="border-border/50 shadow-lg gradient-border bg-gradient-to-br from-background to-accent/5">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <UserCog className="h-5 w-5" />
                  Admin Login
                </CardTitle>
                <CardDescription>Access the admin dashboard</CardDescription>
              </CardHeader>
              <form onSubmit={handleAdminLogin}>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="adminEmail">Admin Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="transition-all duration-300 focus:border-accent"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="adminPassword">Admin Password</Label>
                      <div className="relative">
                        <Input
                          id="adminPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="pr-10 transition-all duration-300 focus:border-accent"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden group shine-effect"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Admin Login</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-accent to-primary group-hover:opacity-80 transition-opacity duration-300"></span>
                      </>
                    )}
                  </Button>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      Default admin credentials: admin@gmail.com / Aa3232107@
                    </p>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8 text-sm text-muted-foreground text-center max-w-md"
      >
        This is a demo app with local authentication. Your data is stored only in your browser's localStorage.
      </motion.p>
    </div>
  )
}
