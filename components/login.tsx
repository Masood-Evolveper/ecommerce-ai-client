"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useClerk, useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
// import { signInWithGoogle } from "@/lib/auth"; // Assume you have a custom Google sign-in function

export default function Login() {
  const clerk = useClerk();
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoaded, signIn, setActive  } = useSignIn();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!isLoaded) return;
    if (isSignedIn) {
      console.log("Already signed in, redirecting to dashboard");
      // Already signed in, just redirect
      router.push("/dashboard");
      return;
    }
    try {
      const res = await signIn.create({
        identifier: email,
        password: password,
      });
      console.log("Sign-in response:", res);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Sign-in error:", err.errors?.[0]?.message || err);
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      const params = {
        cancelOnTapOutside: false,
        itpSupport: false,
        fedCmSupport: false,
      };
      clerk.openGoogleOneTap(params);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-t from-blue-50 via-purple-50 to-purple-100">
      <div className="absolute top-8 left-8 z-10 flex items-center gap-2">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
        </div>
        <span className="text-white font-medium text-lg">LOGO</span>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* White curved form section */}
        <div className="w-full md:w-1/2 bg-white relative shadow-lg rounded-xl overflow-hidden">
          {/* Curved edge */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-white">
            <svg
              viewBox="0 0 80 800"
              className="absolute right-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <path d="M0,0 Q40,400 0,800 L80,800 L80,0 Z" fill="white" />
            </svg>
          </div>

          {/* Form content */}
          <div className="flex items-center justify-center min-h-screen px-8 md:px-16">
            <div className="w-full max-w-sm space-y-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-sm text-gray-500">Sign in to your account</p>

              {/* Email Input */}
              <div className="space-y-4">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  EMAIL ADDRESS
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@example.com"
                  className="h-12 border-0 border-b-2 border-gray-300 rounded-none px-3 focus:ring-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-4">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  PASSWORD
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  className="h-12 border-0 border-b-2 border-gray-300 rounded-none px-3 focus:ring-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-end pt-2">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                className="w-full h-12 bg-[#151a37] text-white font-medium rounded-lg"
                onClick={handleSignIn}
              >
                LOGIN
              </Button>

              {/* Google Sign-In Button */}
              <Button
                onClick={handleGoogleSignIn}
                className="w-full h-12 text-white font-medium rounded-lg flex items-center justify-center mt-4"
              >
                <span className="mr-2">
                  <Image
                    src="/google.png"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                </span>
                Sign in with Google
              </Button>

              {/* Sign Up Link */}
              <p className="text-sm text-center text-gray-500 mt-4">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Background Image Section */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/loginback.jpeg')",
          }}
        >
          <div className="w-full h-full bg-black/30"></div>
        </div>
      </div>
    </div>
  );
}
