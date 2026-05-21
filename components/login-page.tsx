"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError("Please enter a username and password.")
      return
    }
    onLogin()
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-6" style={{ backgroundColor: "#fe0500" }}>
      <img
        src="/logo_full.png"
        alt="RakyatBanjir"
        className="mb-8 w-52 object-contain"
      />

      <form onSubmit={handleSubmit} className="w-full space-y-3">
        <input
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError("") }}
          className="w-full rounded-md border border-white/50 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/60 outline-none focus:border-white focus:ring-0"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError("") }}
            className="w-full rounded-md border border-white/50 bg-white/10 px-3 py-2 pr-10 text-sm text-white placeholder-white/60 outline-none focus:border-white focus:ring-0"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {error && <p className="text-xs text-white/80">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-md bg-white py-2 text-sm font-semibold text-[#fe0500] hover:bg-white/90"
        >
          Login
        </button>
      </form>
    </div>
  )
}
