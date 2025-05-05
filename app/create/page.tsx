"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Sparkles, ArrowRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import { motion } from "framer-motion"

export default function CreateProposal() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [currentStep, setCurrentStep] = useState(1)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    clientEmail: "",
    projectDescription: "",
    budget: "",
    deadline: "",
    additionalNotes: "",
  })

  useEffect(() => {
    // Get current user
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.title || !formData.clientName) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields in this section",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 2) {
      if (!formData.projectDescription) {
        toast({
          title: "Missing information",
          description: "Please provide a project description",
          variant: "destructive",
        })
        return
      }
    }

    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.clientName || !formData.projectDescription) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // In a real app, this would call the OpenAI API
      // For this MVP, we'll simulate the AI generation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Create a new proposal
      const newProposal = {
        id: uuidv4(),
        title: formData.title,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        projectDescription: formData.projectDescription,
        budget: formData.budget,
        deadline: formData.deadline,
        additionalNotes: formData.additionalNotes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: generateMockProposal(formData),
        userId: currentUser?.id, // Add user ID to the proposal
      }

      // Save to localStorage
      const existingProposals = JSON.parse(localStorage.getItem("proposals") || "[]")
      localStorage.setItem("proposals", JSON.stringify([...existingProposals, newProposal]))

      toast({
        title: "Proposal created",
        description: "Your proposal has been generated successfully",
      })

      // Redirect to the proposal page
      router.push(`/proposal/${newProposal.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate proposal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Proposal Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="E.g., Website Redesign Proposal"
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
                    placeholder="E.g., Acme Inc."
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
                  placeholder="client@example.com"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary"
                />
              </div>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectDescription">
                  Project Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="projectDescription"
                  name="projectDescription"
                  placeholder="Describe the project in detail. What are the goals, requirements, and scope?"
                  rows={6}
                  value={formData.projectDescription}
                  onChange={handleChange}
                  required
                  className="transition-all duration-300 focus:border-primary"
                />
              </div>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    name="budget"
                    placeholder="E.g., $5,000 - $10,000"
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
                  placeholder="Any additional information that might be helpful"
                  rows={3}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:border-primary"
                />
              </div>
            </div>
          </motion.div>
        )
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border rounded-md bg-gradient-to-br from-background to-primary/5">
              <h2 className="text-xl font-bold">{formData.title || "Untitled Proposal"}</h2>
              <p className="text-muted-foreground mt-1">For: {formData.clientName || "Client Name"}</p>

              <div className="mt-4">
                <h3 className="font-semibold">Project Description</h3>
                <p className="mt-1">{formData.projectDescription || "No description provided"}</p>
              </div>

              {formData.budget && (
                <div className="mt-4">
                  <h3 className="font-semibold">Budget</h3>
                  <p className="mt-1">{formData.budget}</p>
                </div>
              )}

              {formData.deadline && (
                <div className="mt-4">
                  <h3 className="font-semibold">Deadline</h3>
                  <p className="mt-1">{new Date(formData.deadline).toLocaleDateString()}</p>
                </div>
              )}

              {formData.additionalNotes && (
                <div className="mt-4">
                  <h3 className="font-semibold">Additional Notes</h3>
                  <p className="mt-1">{formData.additionalNotes}</p>
                </div>
              )}
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6 group" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Button>

      <h1 className="text-3xl font-bold mb-2 gradient-text">Create New Proposal</h1>
      <p className="text-muted-foreground mb-6">Fill in the details below to generate an AI-powered proposal</p>

      <Card className="border-border/50 shadow-lg gradient-border bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle>{currentStep === 4 ? "Review & Generate" : `Step ${currentStep} of 4`}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Enter basic information about your proposal"}
            {currentStep === 2 && "Describe the project in detail"}
            {currentStep === 3 && "Add budget, timeline, and additional notes"}
            {currentStep === 4 && "Review your information before generating the proposal"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress bar */}
          <div className="w-full h-2 bg-secondary mb-8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0"></div>

            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`relative z-10 flex flex-col items-center ${
                  step <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    step < currentStep
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : step === currentStep
                        ? "bg-primary/20 border-2 border-primary text-primary"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? "✓" : step}
                </div>
                <span className="text-xs hidden md:block">
                  {step === 1 && "Basics"}
                  {step === 2 && "Description"}
                  {step === 3 && "Details"}
                  {step === 4 && "Review"}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>{renderStepContent()}</form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1} className="group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="group bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isGenerating}
              className="relative overflow-hidden group shine-effect"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <span className="relative z-10 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Proposal
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

// Helper function to generate a mock proposal
function generateMockProposal(formData: any) {
  return {
    introduction: `Dear ${formData.clientName},\n\nThank you for the opportunity to submit this proposal for your ${formData.title} project. Based on our understanding of your requirements, we are confident that we can deliver a solution that meets your needs and exceeds your expectations.`,

    projectScope: `## Project Scope\n\n${formData.projectDescription}\n\nOur team will work closely with you to ensure that all requirements are met and that the final deliverable aligns with your vision.`,

    timeline: `## Timeline\n\n${formData.deadline ? `We will complete this project by ${new Date(formData.deadline).toLocaleDateString()}.` : "We will work with you to establish a timeline that meets your needs."}\n\nThe project will be divided into the following phases:\n\n1. Discovery and Planning\n2. Design and Development\n3. Testing and Refinement\n4. Deployment and Launch\n5. Post-Launch Support`,

    pricing: `## Pricing\n\n${formData.budget ? `Based on your budget range of ${formData.budget}, we propose the following pricing structure:` : "We propose the following pricing structure:"}\n\n- Discovery and Planning: $X,XXX\n- Design and Development: $X,XXX\n- Testing and Refinement: $X,XXX\n- Deployment and Launch: $X,XXX\n- Post-Launch Support: $X,XXX\n\nTotal: $XX,XXX`,

    conclusion: `## Conclusion\n\nWe are excited about the opportunity to work with you on this project. We believe that our expertise and experience make us the ideal partner for your needs.\n\nPlease feel free to reach out if you have any questions or would like to discuss this proposal further.\n\nSincerely,\n[Your Name]\n[Your Company]`,
  }
}
