"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Share2, Pencil, Check, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
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
  userId: string
}

export default function ProposalPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("preview")
  const [isExporting, setIsExporting] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const proposalContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get current user
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }

    // Load proposal from localStorage
    const loadProposal = () => {
      const storedProposals = JSON.parse(localStorage.getItem("proposals") || "[]")
      const foundProposal = storedProposals.find((p: Proposal) => p.id === params.id)

      if (foundProposal) {
        setProposal(foundProposal)
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

  const handleExportPDF = async () => {
    if (!proposal || !proposalContentRef.current) return

    setIsExporting(true)
    toast({
      title: "Preparing PDF",
      description: "Your proposal is being prepared for download",
    })

    try {
      const element = proposalContentRef.current

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#1a1a1a", // Dark background
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`${proposal.title.replace(/\s+/g, "_")}.pdf`)

      toast({
        title: "PDF Downloaded",
        description: "Your proposal has been downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export the proposal to PDF",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleShareProposal = () => {
    // In a real app, this would generate a shareable link
    // For this MVP, we'll just copy the current URL
    navigator.clipboard.writeText(window.location.href)
    setIsCopied(true)
    toast({
      title: "Link Copied",
      description: "Proposal link copied to clipboard",
    })

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your proposal...</p>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return null
  }

  // Check if user has access to this proposal
  const isAdmin = currentUser?.email === "admin@gmail.com"
  const isOwner = currentUser?.id === proposal.userId

  if (!isAdmin && !isOwner) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" className="mb-6 group" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Button>

        <Card className="p-8 border-border/50 shadow-lg bg-gradient-to-br from-background to-destructive/5">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-destructive">Access Denied</h2>
            <p className="mb-6">You don't have permission to view this proposal.</p>
            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6 group" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">{proposal.title}</h1>
          <p className="text-muted-foreground">
            For {proposal.clientName} • Created on {new Date(proposal.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareProposal}
            className="transition-all duration-300"
            disabled={isCopied}
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="transition-all duration-300"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={() => router.push(`/edit/${proposal.id}`)}
            className="relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
          </Button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="preview" className="transition-all duration-300">
            Preview
          </TabsTrigger>
          <TabsTrigger value="details" className="transition-all duration-300">
            Project Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card
              className="p-8 border-border/50 shadow-lg bg-gradient-to-br from-background to-primary/5"
              ref={proposalContentRef}
            >
              <div className="prose prose-invert max-w-none">
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold mb-2 gradient-text">{proposal.title}</h1>
                  <p className="text-xl mb-2">Prepared for {proposal.clientName}</p>
                  <p className="text-sm text-muted-foreground">{new Date(proposal.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="mb-8 animate-fade-in">
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(proposal.content.introduction) }} />
                </div>

                <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(proposal.content.projectScope) }} />
                </div>

                <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(proposal.content.timeline) }} />
                </div>

                <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(proposal.content.pricing) }} />
                </div>

                <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.8s" }}>
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(proposal.content.conclusion) }} />
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="details">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="p-8 border-border/50 shadow-lg bg-gradient-to-br from-background to-primary/5">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2 gradient-text">Client Information</h2>
                  <p>
                    <strong>Name:</strong> {proposal.clientName}
                  </p>
                  {proposal.clientEmail && (
                    <p>
                      <strong>Email:</strong> {proposal.clientEmail}
                    </p>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2 gradient-text">Project Description</h2>
                  <p>{proposal.projectDescription}</p>
                </div>

                {(proposal.budget || proposal.deadline) && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2 gradient-text">Project Details</h2>
                    {proposal.budget && (
                      <p>
                        <strong>Budget:</strong> {proposal.budget}
                      </p>
                    )}
                    {proposal.deadline && (
                      <p>
                        <strong>Deadline:</strong> {new Date(proposal.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {proposal.additionalNotes && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2 gradient-text">Additional Notes</h2>
                    <p>{proposal.additionalNotes}</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function to format markdown
function formatMarkdown(text: string) {
  if (!text) return ""

  // Convert markdown headings
  let formatted = text.replace(/## (.*?)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-2 gradient-text">$1</h2>')

  // Convert line breaks to <br>
  formatted = formatted.replace(/\n/g, "<br>")

  // Convert lists
  formatted = formatted.replace(/(\d+)\. (.*?)(?=<br>)/g, "<li>$2</li>")
  formatted = formatted.replace(/(<li>.*?<\/li>)+/g, "<ol class='space-y-1 my-4'>$&</ol>")

  return formatted
}
