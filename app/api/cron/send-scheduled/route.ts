import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendScheduledEmail } from "@/lib/email"

export async function GET(req: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find all pending messages that should be sent now
    const now = new Date()
    const messagesToSend = await prisma.message.findMany({
      where: {
        status: "pending",
        scheduledAt: {
          lte: now, // Messages scheduled for now or earlier
        },
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      take: 50, // Process max 50 messages per cron run to avoid timeout
    })

    if (messagesToSend.length === 0) {
      return NextResponse.json({
        message: "No messages to send",
        processed: 0,
      })
    }

    const results = {
      total: messagesToSend.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each message
    for (const message of messagesToSend) {
      try {
        // Send the email
        await sendScheduledEmail({
          to: message.recipientEmail,
          toName: message.recipientName || undefined,
          subject: message.subject,
          body: message.body,
          replyTo: message.user.email,
          replyToName: message.user.name || undefined,
        })

        // Update message status to sent
        await prisma.message.update({
          where: { id: message.id },
          data: {
            status: "sent",
            sentAt: new Date(),
          },
        })

        results.sent++
      } catch (error) {
        console.error(`Failed to send message ${message.id}:`, error)

        // Update message status to failed
        await prisma.message.update({
          where: { id: message.id },
          data: {
            status: "failed",
          },
        })

        results.failed++
        results.errors.push(`Message ${message.id}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return NextResponse.json({
      message: "Cron job completed",
      results,
    })
  } catch (error) {
    console.error("Error in send-scheduled cron job:", error)
    return NextResponse.json(
      {
        error: "Failed to process scheduled messages",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
