import Image from "next/image"
import Link from "next/link"
import { StartButton } from "@/components/start-button"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fefaed]">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="w-32 h-32 relative">
          <Image src="/logo.svg" alt="Offcut Co. Logo" width={120} height={120} className="object-contain" priority />
        </div>

        <nav className="flex items-center gap-8">
          <Link href="#about" className="text-black hover:text-[#185047] transition-colors">
            About
          </Link>
          <Link href="#browse" className="text-black hover:text-[#185047] transition-colors">
            Browse offcuts
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-black hover:text-[#185047] transition-colors">
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-[#185047] text-white px-6 py-2 rounded-md hover:bg-[#185047]/90 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-normal text-black leading-tight">
            Keep track of what's lying around your workshop, and connect you with others nearby who might just need what
            you no longer use
          </h1>

          <StartButton href="/auth/signup" className="mt-12">
            Start
          </StartButton>
        </div>

        {/* Quote Bubbles */}
        <div className="mt-32 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mt-8">
            {/* Quote 1 - Left */}
            <div className="flex flex-col items-center">
              <div className="w-64 h-38">
                <Image
                  src="/left.svg"
                  alt="Green shape"
                  width={64}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Quote 2 - Middle */}
            <div className="flex flex-col items-center">
              <div className="w-64 h-38">
                <Image
                  src="/middle.svg"
                  alt="Coral shape"
                  width={64}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Quote 3 - Right */}
            <div className="flex flex-col items-center">
              <div className="w-64 h-38">
                <Image
                  src="/right.svg"
                  alt="Yellow shape"
                  width={64}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 mt-32 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-[#3b3935] max-w-md">
              Offcut Collective is a platform for circular craftspeople who believe good materials deserve a second
              life. Whether you're working with wood, fabric, ceramics, or steel — we help you keep track of what's
              lying around the workshop, and connect you with others nearby who might just need what you no longer use.
            </p>
            <p className="text-[#3b3935] mt-6">Built in Amsterdam. Open to everyone who builds with purpose.</p>
          </div>
          <div className="flex justify-end items-center gap-4">
            <p className="text-[#3b3935]">Partner of</p>
            <div className="w-32 h-12 relative">
              <Image
                src="/maakschap.png"
                alt="Maakschap Amsterdam Logo"
                width={140}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
