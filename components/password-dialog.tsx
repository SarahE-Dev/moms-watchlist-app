"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { verifyPassword } from "@/lib/auth"

interface PasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  title: string
  description: string
}

export function PasswordDialog({ open, onOpenChange, onSuccess, title, description }: PasswordDialogProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyPassword(password)) {
      setPassword("")
      setError("")
      onOpenChange(false)
      onSuccess()
    } else {
      setError("Incorrect password")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">{title}</DialogTitle>
          <p className="text-gray-100">{description}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Confirm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
