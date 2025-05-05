"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Trash2, ExternalLink, Search, Filter, SortAsc, SortDesc } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "@/components/ui/use-toast"
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
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

interface Proposal {
  id: string
  title: string
  clientName: string
  createdAt: string
  updatedAt: string
  userId: string
}

export default function Dashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">("newest")
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([])
  const [animateCards, setAnimateCards] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const user = JSON.parse(userData)
      setCurrentUser(user)
      setIsAdmin(user.email === "admin@gmail.com")
    }

    // Load proposals from localStorage
    const loadProposals = () => {
      const storedProposals = JSON.parse(localStorage.getItem("proposals") || "[]")

      // If admin, show all proposals, otherwise filter by user ID
      const userProposals = isAdmin
        ? storedProposals
        : storedProposals.filter((p: Proposal) => {
            const userData = localStorage.getItem("currentUser")
            let user
            if (userData) {
              user = JSON.parse(userData)
              return p.userId === user.id
            }
            return false
          })

      setProposals(userProposals)
      setIsLoading(false)

      // Delay animation for a smoother experience
      setTimeout(() => {
        setAnimateCards(true)
      }, 300)
    }

    loadProposals()
  }, [])

  useEffect(() => {
    // Filter and sort proposals
    let result = [...proposals]

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (proposal) =>
          proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort proposals
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredProposals(result)
  }, [proposals, searchTerm, sortBy])

  const deleteProposal = (id: string) => {
    const updatedProposals = proposals.filter((proposal) => proposal.id !== id)
    setProposals(updatedProposals)

    // Update all proposals in localStorage (for admin)
    const allProposals = JSON.parse(localStorage.getItem("proposals") || "[]")
    const filteredAllProposals = allProposals.filter((p: Proposal) => p.id !== id)
    localStorage.setItem("proposals", JSON.stringify(filteredAllProposals))

    toast({
      title: "Proposal deleted",
      description: "The proposal has been deleted successfully",
    })
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">{isAdmin ? "Admin Dashboard" : "Your Proposals"}</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Manage all user proposals" : "Manage and create new proposals"}
          </p>
        </div>
        <Link href="/create">
          <Button className="relative overflow-hidden group shine-effect">
            <span className="relative z-10 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Proposal
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search proposals..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SortAsc className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setSortBy("newest")}
              className={sortBy === "newest" ? "bg-primary/10" : ""}
            >
              <SortDesc className="h-4 w-4 mr-2" />
              Newest first
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("oldest")}
              className={sortBy === "oldest" ? "bg-primary/10" : ""}
            >
              <SortAsc className="h-4 w-4 mr-2" />
              Oldest first
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("alphabetical")}
              className={sortBy === "alphabetical" ? "bg-primary/10" : ""}
            >
              <Filter className="h-4 w-4 mr-2" />
              Alphabetical
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading proposals...</p>
          </div>
        </div>
      ) : filteredProposals.length === 0 ? (
        <Card className="border-dashed border-2 border-border bg-gradient-to-br from-background to-primary/5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-4">
              <FileText className="h-16 w-16 text-primary" />
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl -z-10"></div>
            </div>
            <h3 className="text-xl font-medium mb-2">No proposals yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {searchTerm
                ? "No proposals match your search. Try a different search term."
                : isAdmin
                  ? "There are no proposals in the system yet."
                  : "Create your first proposal to get started. Our AI will help you craft the perfect proposal for your clients."}
            </p>
            <Link href="/create">
              <Button className="relative overflow-hidden group">
                <span className="relative z-10 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Proposal
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                custom={index}
                initial="hidden"
                animate={animateCards ? "visible" : "hidden"}
                variants={cardVariants}
                layout
              >
                <Card className="hover:border-primary/50 transition-all duration-300 card-hover-effect gradient-border bg-gradient-to-br from-background to-primary/5">
                  <CardHeader>
                    <CardTitle className="truncate">{proposal.title}</CardTitle>
                    <CardDescription>Client: {proposal.clientName}</CardDescription>
                    {isAdmin && proposal.userId && (
                      <CardDescription className="mt-1 text-xs">
                        <span className="text-primary">User ID: {proposal.userId}</span>
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Created {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last updated {formatDistanceToNow(new Date(proposal.updatedAt), { addSuffix: true })}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href={`/proposal/${proposal.id}`}>
                      <Button variant="outline" size="sm" className="group">
                        <ExternalLink className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                        View
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the proposal.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteProposal(proposal.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
