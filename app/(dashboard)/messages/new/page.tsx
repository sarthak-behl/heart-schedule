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

export default function NewMessagePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showWizard, setShowWizard] = useState(false)

  // Form state
  const [occasion, setOccasion] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [timezone, setTimezone] = useState("")

  // Auto-detect user's timezone on mount
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimezone(userTimezone)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
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
          subject,
          body,
          scheduledAt,
          isAiGenerated: false,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create message")
        return
      }

      // Success! Redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Get minimum date/time (1 hour from now)
  const getMinDateTime = () => {
    const now = new Date()
    now.setHours(now.getHours() + 1)
    return {
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
    }
  }

  const minDateTime = getMinDateTime()

  // Redirect to wizard if showWizard is true
  useEffect(() => {
    if (showWizard) {
      router.push("/messages/new/wizard")
    }
  }, [showWizard, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              ← Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Message
          </h1>
          <p className="text-gray-600">
            Schedule a heartfelt message to be sent at the perfect moment
          </p>
        </div>

        {/* Method Selection */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="border-2 border-purple-500 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">✍️</span>
                Write Manually
              </CardTitle>
              <CardDescription>
                Craft your own personal message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Perfect for when you know exactly what you want to say
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium inline-block">
                Currently Active
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-300"
                onClick={() => setShowWizard(true)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🪄</span>
                AI Wizard
              </CardTitle>
              <CardDescription>
                Let AI help you write the perfect message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Get AI assistance with tone, style, and personalization
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium inline-block">
                ✨ AI-Powered
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manual Form */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Message Details</CardTitle>
              <CardDescription>
                Fill in the details for your scheduled message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Occasion */}
              <div className="space-y-2">
                <Label htmlFor="occasion">Occasion *</Label>
                <Select value={occasion} onValueChange={setOccasion} required>
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
              </div>

              {/* Recipient Email */}
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Recipient Email *</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="recipient@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Recipient Name */}
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name (optional)</Label>
                <Input
                  id="recipientName"
                  type="text"
                  placeholder="John Doe"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject *</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Happy Birthday!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <Label htmlFor="body">Your Message *</Label>
                <Textarea
                  id="body"
                  placeholder="Write your heartfelt message here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  disabled={isLoading}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  This message will be sent exactly as written
                </p>
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label htmlFor="timezone">Your Timezone *</Label>
                <Select value={timezone} onValueChange={setTimezone} required disabled={isLoading}>
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

              {/* Schedule Date & Time */}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900">
                <strong>Note:</strong> Your message will be sent from HeartSchedule on your behalf at the specified time in your timezone.
                The recipient will see your email in the reply-to field.
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Scheduling..." : "Schedule Message"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
