"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Loader2, Save, User, Lock, Bell, Trash2, ArrowLeft } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
  })

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        ...formData,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        company: parsedUser.company || "",
      })
    } else {
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSaveProfile = () => {
    setIsSaving(true)

    setTimeout(() => {
      // Update user in localStorage
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        company: formData.company,
      }

      // Update in users array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u: any) => (u.id === user.id ? updatedUser : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Update current user
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setUser(updatedUser)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      setIsSaving(false)
    }, 1000)
  }

  const handleChangePassword = () => {
    setIsSaving(true)

    // Validate passwords
    if (formData.currentPassword !== user.password) {
      toast({
        title: "Incorrect password",
        description: "Your current password is incorrect",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation don't match",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }

    if (formData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }

    setTimeout(() => {
      // Update password in localStorage
      const updatedUser = {
        ...user,
        password: formData.newPassword,
      }

      // Update in users array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u: any) => (u.id === user.id ? updatedUser : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Update current user
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      })

      setIsSaving(false)
    }, 1000)
  }

  const handleDeleteAccount = () => {
    // Remove user from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.filter((u: any) => u.id !== user.id)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Remove current user
    localStorage.removeItem("currentUser")

    toast({
      title: "Account deleted",
      description: "Your account has been deleted successfully",
    })

    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6 group" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-2 gradient-text">Settings</h1>
        <p className="text-muted-foreground mb-6">Manage your account settings and preferences</p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="transition-all duration-300">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="transition-all duration-300">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="transition-all duration-300">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-border/50 shadow-lg gradient-border bg-gradient-to-br from-background to-primary/5">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="relative overflow-hidden group shine-effect"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-border/50 shadow-lg gradient-border mb-6 bg-gradient-to-br from-background to-primary/5">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className="relative overflow-hidden group shine-effect"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        Update Password
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-border/50 shadow-lg bg-gradient-to-br from-background to-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. This action cannot be undone.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data
                        from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-border/50 shadow-lg gradient-border bg-gradient-to-br from-background to-primary/5">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="emailNotifications" className="font-normal">
                      Email notifications
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about new proposals, updates, and account activity.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    toast({
                      title: "Preferences saved",
                      description: "Your notification preferences have been updated",
                    })
                  }}
                  className="relative overflow-hidden group shine-effect"
                >
                  <span className="relative z-10 flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
