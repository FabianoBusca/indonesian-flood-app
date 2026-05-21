"use client"

import { useEffect, useState } from "react"
import { FloodApp } from "@/components/flood-app"
import { LoginPage } from "@/components/login-page"

export function AppShell() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("rb_auth") === "1") setLoggedIn(true)
    setReady(true)
  }, [])

  function handleLogin() {
    localStorage.setItem("rb_auth", "1")
    setLoggedIn(true)
  }

  if (!ready) return null

  function handleLogout() {
    localStorage.removeItem("rb_auth")
    setLoggedIn(false)
  }

  return loggedIn ? <FloodApp onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />
}
