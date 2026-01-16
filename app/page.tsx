import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-20">
          <h1 className="text-2xl font-bold text-purple-600">HeartSchedule</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Never Miss a
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                {" "}Heartfelt Moment
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Schedule emotional messages for birthdays, anniversaries, and special occasions.
              Let AI help you express what matters most, delivered at the perfect time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6">
                  Schedule Your First Message
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🎂</div>
              <h3 className="text-xl font-semibold mb-2">Choose Occasion</h3>
              <p className="text-gray-600">
                Birthday, anniversary, apology, gratitude, or just because
              </p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Write or AI-Generate</h3>
              <p className="text-gray-600">
                Craft your own message or let AI help you express your feelings
              </p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-semibold mb-2">Schedule & Relax</h3>
              <p className="text-gray-600">
                Set the date and time. We'll send it for you automatically
              </p>
            </div>
          </div>

          <div className="mt-24 p-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl text-white">
            <h3 className="text-3xl font-bold mb-4">
              Emotional reliability, automated
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Join others who never miss important moments
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Free Today
              </Button>
            </Link>
          </div>
        </main>

        <footer className="mt-24 text-center text-gray-600">
          <p>&copy; 2026 HeartSchedule. Built with care.</p>
        </footer>
      </div>
    </div>
  )
}
