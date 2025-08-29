'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export function EmailVerificationModal({ isOpen, onClose, email }: EmailVerificationModalProps) {
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Send email when modal opens
  useEffect(() => {
    if (isOpen && email && !emailSent) {
      const sendEmail = async () => {
        try {
          // Get CSRF token first
          const csrfResponse = await fetch('/api/auth/csrf')
          const { csrfToken } = await csrfResponse.json()
          
          // Call NextAuth API with CSRF token
          const response = await fetch('/api/auth/signin/resend', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              email: email,
              callbackUrl: window.location.origin,
              csrfToken: csrfToken,
            }),
          })
          setEmailSent(true)
        } catch (error) {
          console.error('Failed to send email:', error)
        }
      }
      sendEmail()
    }
    
    // Reset emailSent when modal closes
    if (!isOpen) {
      setEmailSent(false)
      setTimeLeft(300)
      setCanResend(false)
    }
  }, [isOpen, email, emailSent])

  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleResend = async () => {
    // Reset timer and trigger resend
    setTimeLeft(300)
    setCanResend(false)
    
    try {
      // Get CSRF token first
      const csrfResponse = await fetch('/api/auth/csrf')
      const { csrfToken } = await csrfResponse.json()
      
      // Resend the magic link using direct API call with CSRF token
      await fetch('/api/auth/signin/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: email,
          callbackUrl: window.location.origin,
          csrfToken: csrfToken,
        }),
      })
    } catch (error) {
      console.error('Failed to resend email:', error)
    }
  }

  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header with animated mail icon */}
            <div className="text-center mb-6">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-4"
              >
                <Mail className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                Check Your Email
              </h2>
              
              <p className="text-slate-300 text-sm">
                We&apos;ve sent a magic link to
              </p>
              <p className="text-blue-400 font-medium text-sm break-all">
                {email}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <span className="text-slate-300 text-sm">Check your email inbox</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <span className="text-slate-300 text-sm">Click the sign-in link</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-slate-300 text-sm">Get redirected back here</span>
              </div>
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <p className="text-slate-400 text-sm mb-2">
                Link expires in
              </p>
              <div className="text-2xl font-mono font-bold text-white">
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {canResend ? (
                <Button
                  onClick={handleResend}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Email
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-slate-400 text-sm">
                    Can&apos;t find the email? Check your spam folder
                  </p>
                </div>
              )}
              
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                Continue Browsing
              </Button>
            </div>

            {/* Background decoration */}
            <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl -z-10 blur-xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
