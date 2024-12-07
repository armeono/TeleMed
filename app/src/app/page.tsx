import Image from "next/image";
import {
  Calendar,
  MessageSquare,
  Video,
  Stethoscope,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full flex items-center px-8 py-6 justify-between">
        <div className="flex items-center gap-4">
          <Stethoscope className="h-8 w-8 text-red-600" />
          <span className="font-bold text-gray-900 text-2xl">TeleMed</span>
        </div>

        <div className="flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-base font-semibold hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-base font-semibold hover:underline underline-offset-4"
          >
            Testimonials
          </Link>
          <Link
            href="#contact"
            className="text-base font-semibold hover:underline underline-offset-4"
          >
            Contact
          </Link>
        </div>
      </header>
      <main>
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100">
          <div className="flex flex-col justify-center items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Welcome to TeleMed
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 text-center">
              Connecting patients and doctors seamlessly. Experience healthcare
              like never before.
            </p>
            <div className="flex items-center gap-4">
              <Link
                className="rounded-md bg-red-600 text-white hover:bg-red-700 h-9 px-4 py-2 flex items-center justify-center"
                href="/register"
              >
                Get started
              </Link>
              <Button variant="outline">Learn more</Button>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-20 bg-white flex justify-center items-center "
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Calendar className="h-8 w-8 text-red-600 mb-2" />
                  <CardTitle>Easy Scheduling</CardTitle>
                </CardHeader>
                <CardContent>
                  Book appointments with your preferred doctors at your
                  convenience.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MessageSquare className="h-8 w-8 text-red-600 mb-2" />
                  <CardTitle>Secure Messaging</CardTitle>
                </CardHeader>
                <CardContent>
                  Communicate directly with your healthcare providers through
                  our secure platform.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Video className="h-8 w-8 text-red-600 mb-2" />
                  <CardTitle>Video Consultations</CardTitle>
                </CardHeader>
                <CardContent>
                  Access healthcare from the comfort of your home with video
                  consultations.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-red-600 mb-2" />
                  <CardTitle>Data Security</CardTitle>
                </CardHeader>
                <CardContent>
                  Your health information is protected with state-of-the-art
                  security measures.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-8 w-8 text-red-600 mb-2" />
                  <CardTitle>24/7 Access</CardTitle>
                </CardHeader>
                <CardContent>
                  Access your health records and communicate with doctors
                  anytime, anywhere.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Stethoscope className="h-8 w-8 text-red-600 mb-2" />
                  <CardTitle>Comprehensive Care</CardTitle>
                </CardHeader>
                <CardContent>
                  From general check-ups to specialist consultations, we've got
                  you covered.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="cta"
          className="w-full py-12 md:py-24 lg:py-32 bg-red-600 text-white flex justify-center items-center"
        >
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Healthcare Experience?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl">
                  Join TeleMed today and take control of your health journey.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  href="/register"
                  className="rounded-md bg-white text-red-600 hover:bg-gray-200 h-9 px-4 py-2 flex items-center justify-center"
                >
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 TeleMed. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
      <Toaster />
    </div>
  );
}
