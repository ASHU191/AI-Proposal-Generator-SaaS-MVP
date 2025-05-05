"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

interface ProposalContent {
  introduction: string
  projectScope: string
  timeline: string
  pricing: string
  conclusion: string
}

interface Proposal {
  id: string
  title: string
  clientName: string
  clientEmail: string
  projectDescription: string
  budget: string
  deadline: string
  additionalNotes: string
  createdAt: string
  updatedAt: string
  content: ProposalContent
}

export default function EditProposal({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    clientEmail: "",
    projectDescription: "",
    budget: "",
    deadline: "",
    additionalNotes: "",
    introduction: "",
    projectScope: "",
    timeline: "",
    pricing: "",
    conclusion: "",
  })

  useEffect(() => {
    // Load proposal from localStorage
    const loadProposal = () => {
      const storedProposals = JSON.parse(localStorage.getItem("proposals") || "[]")
      const foundProposal = storedProposals.find((p: Proposal) => p.id === params.id)

      if (foundProposal) {
        setProposal(foundProposal)
        setFormData({
          title: foundProposal.title,
          clientName: foundProposal.clientName,
          clientEmail: foundProposal.clientEmail || "",
          projectDescription: foundProposal.projectDescription,
          budget: foundProposal.budget || "",
          deadline: foundProposal.deadline || "",
          additionalNotes: foundProposal.additionalNotes || "",
          introduction: foundProposal.content.introduction,
          projectScope: foundProposal.content.projectScope,
          timeline: foundProposal.content.timeline,
          pricing: foundProposal.content.pricing,
          conclusion: foundProposal.content.conclusion,
        })
      } else {
        toast({
          title: "Proposal not found",
          description: "The requested proposal could not be found",
          variant: "destructive",
        })
        router.push("/dashboard")
      }

      setIsLoading(false)
    }

    loadProposal()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    if (!proposal) return

    setIsSaving(true)

    // Validate form
    if (!formData.title || !formData.clientName || !formData.projectDescription) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }

    setTimeout(() => {
      try {
        // Update proposal
        const updatedProposal = {
          ...proposal,
          title: formData.title,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          projectDescription: formData.projectDescription,
          budget: formData.budget,
          deadline: formData.deadline,
          additionalNotes: formData.additionalNotes,
          updatedAt: new Date().toISOString(),
          content: {
            introduction: formData.introduction,
            projectScope: formData.projectScope,
            timeline: formData.timeline,
            pricing: formData.pricing,
            conclusion: formData.conclusion,
          },
        }

        // Update in localStorage
        const storedProposals = JSON.parse(localStorage.getItem("proposals") || "[]")
        const updatedProposals = storedProposals.map((p: Proposal) => (p.id === params.id ? updatedProposal : p))
        localStorage.setItem("proposals", JSON.stringify(updatedProposals))

        toast({
          title: "Proposal updated",
          description: "Your proposal has been updated successfully",
        })

        router.push(`/proposal/${params.id}`)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update proposal. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading proposal...</p>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6 group" onClick={() => router.push(`/proposal/${params.id}`)}>
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Proposal
      </Button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-2 gradient-text">Edit Proposal</h1>
        <p className="text-muted-foreground mb-6">Make changes to your proposal</p>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-lg gradient-border">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Edit the basic details of your proposal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Proposal Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientName">
                    Client Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">
                  Project Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="projectDescription"
                  name="projectDescription"
                  rows={4}
                  value={formData.projectDescription}
                  onChange={handleChange}
                  required
                  className="transition-all duration-300 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="transition-all duration-300 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  rows={3}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg gradient-border">
            <CardHeader>
              <CardTitle>Proposal Content</CardTitle>
              <CardDescription>Edit the content sections of your proposal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="introduction">Introduction</Label>
                <Textarea
                  id="introduction"
                  name="introduction"
                  rows={4}
                  value={formData.introduction}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectScope">Project Scope</Label>
                <Textarea
                  id="projectScope"
                  name="projectScope"
                  rows={6}
                  value={formData.projectScope}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Textarea
                  id="timeline"
                  name="timeline"
                  rows={6}
                  value={formData.timeline}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing">Pricing</Label>
                <Textarea
                  id="pricing"
                  name="pricing"
                  rows={6}
                  value={formData.pricing}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conclusion">Conclusion</Label>
                <Textarea
                  id="conclusion"
                  name="conclusion"
                  rows={4}
                  value={formData.conclusion}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving} className="relative overflow-hidden group shine-effect">
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
        </div>
      </motion.div>
    </div>
  )
}
