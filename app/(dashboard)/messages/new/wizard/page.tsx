"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const occasions = [
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "anniversary", label: "Anniversary", emoji: "❤️" },
  { value: "apology", label: "Apology", emoji: "🙏" },
  { value: "gratitude", label: "Gratitude", emoji: "🙌" },
  { value: "congratulations", label: "Congratulations", emoji: "🎉" },
  { value: "just_because", label: "Just Because", emoji: "💌" },
  { value: "custom", label: "Custom", emoji: "✉️" },
]

const tones = [
  { value: "warm", label: "Warm & Friendly", description: "Perfect for close friends and family" },
  { value: "heartfelt", label: "Deeply Heartfelt", description: "For expressing deep emotions" },
  { value: "casual", label: "Casual & Relaxed", description: "Light and conversational" },
  { value: "formal", label: "Professional & Respectful", description: "For professional relationships" },
]

const timezones = [
  { value: "Asia/Kolkata", label: "IST - India Standard Time (UTC+5:30)" },
  { value: "America/New_York", label: "EST - Eastern Time (UTC-5)" },
  { value: "America/Chicago", label: "CST - Central Time (UTC-6)" },
  { value: "America/Denver", label: "MST - Mountain Time (UTC-7)" },
  { value: "America/Los_Angeles", label: "PST - Pacific Time (UTC-8)" },
  { value: "Europe/London", label: "GMT - London (UTC+0)" },
  { value: "Europe/Paris", label: "CET - Paris (UTC+1)" },
  { value: "Asia/Dubai", label: "GST - Dubai (UTC+4)" },
  { value: "Asia/Singapore", label: "SGT - Singapore (UTC+8)" },
  { value: "Asia/Tokyo", label: "JST - Tokyo (UTC+9)" },
  { value: "Australia/Sydney", label: "AEDT - Sydney (UTC+11)" },
  { value: "UTC", label: "UTC - Coordinated Universal Time" },
]

type Step = "occasion" | "recipient" | "generate" | "edit" | "schedule"

export default function AIWizardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>("occasion")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [occasion, setOccasion] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [tone, setTone] = useState("")
  const [context, setContext] = useState("")
  const [generatedSubject, setGeneratedSubject] = useState("")
  const [generatedBody, setGeneratedBody] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [timezone, setTimezone] = useState("")

  // Auto-detect user's timezone on mount
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimezone(userTimezone)
  }, [])

  const handleGenerateMessage = async () => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion,
          recipientName: recipientName || undefined,
          tone,
          context,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to generate message")
        return
      }

      setGeneratedSubject(data.subject)
      setGeneratedBody(data.body)
      setCurrentStep("edit")
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Convert local time to UTC based on selected timezone
      const localDateTime = `${scheduledDate}T${scheduledTime}:00`
      const scheduledAt = new Date(new Date(localDateTime).toLocaleString("en-US", { timeZone: timezone })).toISOString()

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion,
          recipientEmail,
          recipientName: recipientName || undefined,
          subject: generatedSubject,
          body: generatedBody,
          scheduledAt,
          isAiGenerated: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create message")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getMinDateTime = () => {
    const now = new Date()
    now.setHours(now.getHours() + 1)
    return {
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
    }
  }

  const minDateTime = getMinDateTime()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/messages/new">
            <Button variant="ghost" className="mb-4">
              ← Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🪄 AI Message Wizard
          </h1>
          <p className="text-gray-600">
            Let AI help you craft the perfect heartfelt message
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {["occasion", "recipient", "generate", "edit", "schedule"].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step
                    ? "bg-purple-600 text-white"
                    : index < ["occasion", "recipient", "generate", "edit", "schedule"].indexOf(currentStep)
                    ? "bg-purple-200 text-purple-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              {index < 4 && <div className="w-12 h-1 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Occasion Selection */}
        {currentStep === "occasion" && (
          <Card>
            <CardHeader>
              <CardTitle>Choose the Occasion</CardTitle>
              <CardDescription>What's this message for?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map((occ) => (
                    <SelectItem key={occ.value} value={occ.value}>
                      <span className="flex items-center gap-2">
                        <span>{occ.emoji}</span>
                        <span>{occ.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => setCurrentStep("recipient")}
                disabled={!occasion}
                className="w-full"
              >
                Next: Recipient Details
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Recipient Details */}
        {currentStep === "recipient" && (
          <Card>
            <CardHeader>
              <CardTitle>Recipient Details</CardTitle>
              <CardDescription>Who will receive this message?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Recipient Email *</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="recipient@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name (optional)</Label>
                <Input
                  id="recipientName"
                  type="text"
                  placeholder="John Doe"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Adding a name helps personalize the message
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("occasion")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep("generate")}
                  disabled={!recipientEmail}
                  className="flex-1"
                >
                  Next: Generate Message
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Generate Message */}
        {currentStep === "generate" && (
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Message</CardTitle>
              <CardDescription>
                Tell us what you want to say, and choose a tone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Message Tone *</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        <div>
                          <div className="font-medium">{t.label}</div>
                          <div className="text-xs text-gray-500">{t.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="context">What do you want to say? *</Label>
                <Textarea
                  id="context"
                  placeholder="Example: Thank them for always being there for me during tough times. Mention how their support helped me through my recent job change."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Be specific! The more context you provide, the better the AI can craft your message.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("recipient")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleGenerateMessage}
                  disabled={!tone || !context || context.length < 10 || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Generating..." : "✨ Generate Message"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Edit Generated Message */}
        {currentStep === "edit" && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Edit Your Message</CardTitle>
              <CardDescription>
                Feel free to edit the AI-generated message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-purple-700">
                  ✨ AI has crafted a message for you! You can use it as is or make any changes you'd like.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  value={generatedSubject}
                  onChange={(e) => setGeneratedSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Message Body</Label>
                <Textarea
                  id="body"
                  value={generatedBody}
                  onChange={(e) => setGeneratedBody(e.target.value)}
                  rows={10}
                  className="resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleGenerateMessage}
                  disabled={isLoading}
                  className="flex-1"
                >
                  🔄 Regenerate
                </Button>
                <Button
                  onClick={() => setCurrentStep("schedule")}
                  disabled={!generatedSubject || !generatedBody}
                  className="flex-1"
                >
                  Next: Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Schedule */}
        {currentStep === "schedule" && (
          <Card>
            <form onSubmit={handleScheduleMessage}>
              <CardHeader>
                <CardTitle>Schedule Your Message</CardTitle>
                <CardDescription>When should we send this message?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Your Timezone *</Label>
                  <Select value={timezone} onValueChange={setTimezone} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Auto-detected: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Send Date *</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={minDateTime.date}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Send Time *</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900">
                  <strong>Note:</strong> Your message will be sent from HeartSchedule on your behalf at the specified time in your timezone.
                  The recipient will see your email in the reply-to field.
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep("edit")}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Scheduling..." : "Schedule Message"}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}
