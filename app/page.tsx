"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Zap, Clock, PenTool, BarChart, Sparkles, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="blob w-[400px] h-[400px] bg-primary/20 top-[-100px] right-[-100px]"></div>
      <div className="blob w-[500px] h-[500px] bg-accent/20 bottom-[-200px] left-[-200px]"></div>

      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <FileText className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10"></div>
            </div>
            <span className="font-bold text-xl">ProposalAI</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-primary/10 transition-all duration-300">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="relative overflow-hidden group">
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-6xl font-bold mb-6 gradient-text"
            >
              AI-Powered Proposal Generator
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto"
            >
              Create professional proposals, quotations, and scope of work documents in minutes, not hours.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Link href="/signup">
                <Button size="lg" className="gap-2 relative overflow-hidden group shine-effect">
                  <span className="relative z-10">Start Creating</span>
                  <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-secondary/50 relative">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold text-center mb-4"
            >
              Key Features
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-20 h-1 bg-primary mx-auto mb-12 rounded-full"
            ></motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="AI-Powered Content"
                description="Generate professional proposals based on simple client requirements"
                delay={0}
              />
              <FeatureCard
                icon={<Clock className="h-10 w-10 text-primary" />}
                title="Save Time"
                description="Create proposals in minutes instead of hours or days"
                delay={0.1}
              />
              <FeatureCard
                icon={<PenTool className="h-10 w-10 text-primary" />}
                title="Customizable"
                description="Tailor proposals to match your brand and client needs"
                delay={0.2}
              />
              <FeatureCard
                icon={<BarChart className="h-10 w-10 text-primary" />}
                title="Smart Pricing"
                description="AI suggests optimal pricing based on project scope"
                delay={0.3}
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="PDF Export"
                description="Download professional PDFs ready to send to clients"
                delay={0.4}
              />
              <FeatureCard
                icon={<Sparkles className="h-10 w-10 text-primary" />}
                title="Shareable Links"
                description="Share proposals directly with clients via secure links"
                delay={0.5}
              />
            </div>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="blob w-[300px] h-[300px] bg-primary/20 top-[20%] right-[10%]"></div>

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl font-bold mb-6">How It Works</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Enter Project Details</h3>
                      <p className="text-muted-foreground">
                        Fill in your client information and project requirements through our intuitive form.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">AI Generation</h3>
                      <p className="text-muted-foreground">
                        Our AI analyzes your inputs and generates a professional proposal tailored to your needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Review & Export</h3>
                      <p className="text-muted-foreground">
                        Review the generated proposal, make any adjustments, and export as a professional PDF.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative"
              >
                <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-xl p-6 bg-card">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-30"></div>
                  <h3 className="text-2xl font-bold mb-4 gradient-text">Generate Proposals Instantly</h3>
                  <p className="mb-4">
                    Our AI technology helps you create professional proposals in just a few clicks:
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckItem /> Customizable templates
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckItem /> Professional formatting
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckItem /> Smart pricing suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckItem /> Export to PDF instantly
                    </li>
                  </ul>
                  <Link href="/signup">
                    <Button className="w-full relative overflow-hidden group">
                      <span className="relative z-10">Try It Now</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
                    </Button>
                  </Link>
                </div>
                <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="ProposalAI has saved me countless hours. I can now create professional proposals in minutes!"
                author="Sarah Johnson"
                role="Freelance Designer"
                delay={0}
              />
              <TestimonialCard
                quote="The AI-generated content is surprisingly good. It's like having a professional copywriter on my team."
                author="Michael Chen"
                role="Marketing Consultant"
                delay={0.2}
              />
              <TestimonialCard
                quote="My client conversion rate has increased by 40% since I started using ProposalAI. Worth every penny!"
                author="David Rodriguez"
                role="Web Developer"
                delay={0.4}
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold mb-6"
            >
              Ready to streamline your proposal process?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Join freelancers and agencies who are saving time and winning more clients with AI-powered proposals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Link href="/signup">
                <Button size="lg" className="relative overflow-hidden group shine-effect">
                  <span className="relative z-10">Get Started for Free</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity duration-300"></span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <FaqItem
                question="How does the AI proposal generation work?"
                answer="Our AI analyzes your inputs about the client, project requirements, and budget to generate a professionally structured proposal. It uses advanced language models to create compelling content tailored to your specific needs."
              />
              <FaqItem
                question="Can I customize the generated proposals?"
                answer="After the AI generates the initial proposal, you can edit any section, add your branding, and customize the content to perfectly match your style and requirements."
              />
              <FaqItem
                question="Is my data secure?"
                answer="Yes, we take data security seriously. In this version, all your data is stored locally on your device using localStorage, so your information never leaves your computer."
              />
              <FaqItem
                question="Can I export my proposals to PDF?"
                answer="Yes, you can export any proposal to a professional-looking PDF document that's ready to share with your clients."
              />
              <FaqItem
                question="Do I need an internet connection?"
                answer="For the MVP version, once the application is loaded, you can create and view proposals without an internet connection since everything is stored locally."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">ProposalAI</span>
              </div>
              <p className="text-muted-foreground">AI-powered proposal generation for freelancers and agencies.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-8 pt-8 text-center text-muted-foreground">
            <p> © 2025 ProposalAI. All rights reserved. Built with ❤️ by Arslan Aftab.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-card p-6 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 card-hover-effect"
    >
      <div className="mb-4 relative">
        {icon}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10"></div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
  delay = 0,
}: {
  quote: string
  author: string
  role: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-card p-6 rounded-lg border border-border/50 relative card-hover-effect"
    >
      <div className="absolute top-4 left-4 text-4xl text-primary/20">"</div>
      <div className="pt-6">
        <p className="mb-6 relative z-10">{quote}</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            {author.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-border/40 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-semibold py-2"
      >
        {question}
        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
      >
        <p className="text-muted-foreground pb-2">{answer}</p>
      </div>
    </div>
  )
}

function CheckItem() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}
