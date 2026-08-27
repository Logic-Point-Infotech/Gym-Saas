'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validators/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dumbbell, Eye, EyeOff, Sparkles, HeartPulse, Activity } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (!res.ok) {
        toast({ title: 'Login Failed', description: result.message, variant: 'error' })
        return
      }

      toast({ title: 'Welcome back!', description: 'Redirecting to dashboard...', variant: 'success' })
      router.push('/dashboard')
    } catch {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-background">
      {/* Left Section: Visual / Pattern */}
      <div className="relative hidden md:flex md:w-1/2 bg-gradient-to-tr from-primary to-accent overflow-hidden flex-col justify-between p-12">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />

        {/* Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Dumbbell className="text-white h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold text-white tracking-tight">Vyayam AI</span>
          </div>
        </div>

        {/* Graphic Mockup Area */}
        <div className="relative z-10 flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                AI Health Analytics
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-glow" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/25">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Marcus Sterling</p>
                  <p className="text-xs text-white/60">Target: 82.5 kg</p>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-xs text-white/80 mb-1">
                  <span>Health Index</span>
                  <span>92%</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 w-[92%]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-white/80">
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <p className="text-[10px] text-white/40 uppercase font-semibold">Active Cal</p>
                  <p className="text-xs font-bold mt-0.5 text-emerald-300">2.1k Kcal</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                  <p className="text-[10px] text-white/40 uppercase font-semibold">Daily Steps</p>
                  <p className="text-xs font-bold mt-0.5 text-teal-300">12.4k</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-white/60 text-xs">
          <p>© {new Date().getFullYear()} Vyayam AI. Executive Wellness Intelligence.</p>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 flex flex-col items-center">
          {/* Logo on mobile */}
          <div className="md:hidden flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Dumbbell className="text-white h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold text-primary tracking-tight">Vyayam AI</span>
          </div>

          <Card className="w-full glass-card border-border/40 shadow-xl bg-card/60 backdrop-blur-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold">Sign in to Executive Portal</CardTitle>
              <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gymadmin.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      error={errors.password?.message}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-2" isLoading={isLoading}>
                  Sign In
                </Button>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  Default Credentials: <code className="bg-muted px-1.5 py-0.5 rounded text-primary">admin@gymadmin.com</code> / <code className="bg-muted px-1.5 py-0.5 rounded text-primary">Admin@123</code>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
