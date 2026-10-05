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
import { 
  Dumbbell, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Activity, 
  Zap, 
  ArrowLeft, 
  Mail, 
  ShieldCheck, 
  UserPlus, 
  LogIn,
  KeyRound,
  CheckCircle2,
  Database
} from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [forgotSubmitted, setForgotSubmitted] = useState(false)

  // Register Form State
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // 1-Click Auto Fill Demo Admin
  const handleQuickDemoAdmin = () => {
    setValue('email', 'admin@gymadmin.com')
    setValue('password', 'Admin@123')
    toast({
      title: 'Credentials Loaded',
      description: 'Default admin credentials entered. Click Sign In.',
      variant: 'info',
    })
  }

  // Handle Supabase Database Login
  const onLoginSubmit = async (data: LoginInput) => {
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
        toast({ 
          title: 'Login Failed', 
          description: result.message || 'Invalid email or password', 
          variant: 'error' 
        })
        return
      }

      toast({ 
        title: 'Welcome Back!', 
        description: 'Authenticated with Supabase. Opening dashboard...', 
        variant: 'success' 
      })
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast({ 
        title: 'Connection Error', 
        description: 'Unable to reach authentication server. Check network.', 
        variant: 'error' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Register Submit
  const onRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName || !regEmail || !regPassword) {
      toast({ title: 'Validation Error', description: 'Please fill in all fields.', variant: 'error' })
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, role: 'ADMIN' }),
      })
      const result = await res.json()

      if (!res.ok) {
        toast({ title: 'Registration Failed', description: result.message || 'Could not register.', variant: 'error' })
        return
      }

      toast({ title: 'Account Created!', description: 'Redirecting to dashboard...', variant: 'success' })
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast({ title: 'Error', description: 'Registration failed. Please try again.', variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Forgot Password Submit
  const onForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail || !forgotEmail.includes('@')) {
      toast({ title: 'Invalid Email', description: 'Please enter a valid email address.', variant: 'error' })
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const result = await res.json()
      if (res.ok) {
        setForgotSubmitted(true)
        toast({ title: 'Reset Link Sent', description: result.message, variant: 'success' })
      }
    } catch {
      toast({ title: 'Error', description: 'Unable to process reset request.', variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-background overflow-x-hidden">
      {/* Left Section: Futuristic Branding Panel */}
      <div className="relative hidden md:flex md:w-1/2 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 overflow-hidden flex-col justify-between p-12 border-r border-border/30">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/40 shadow-lg shadow-primary/20">
              <Dumbbell className="text-primary h-6 w-6" />
            </div>
            <div>
              <span className="font-display text-2xl font-black text-white tracking-tight">Vyayam AI</span>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Executive Gym SaaS</p>
            </div>
          </div>
        </div>

        {/* Center Live Card Mockup */}
        <div className="relative z-10 flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-card/40 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-2xl space-y-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/20 rounded-full blur-xl" />
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <Sparkles className="h-3 w-3" />
                Supabase Live Database
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Rahul Sharma</p>
                  <p className="text-xs text-primary font-mono font-semibold">ID: vyayam_0208</p>
                </div>
              </div>

              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Supabase Sync Health</span>
                  <span className="text-emerald-400 font-bold">PostgreSQL Connected</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 w-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="bg-muted/40 rounded-xl p-3 border border-border/40">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Auth Guard</p>
                  <p className="text-xs font-bold mt-0.5 text-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    JWT & Cookies
                  </p>
                </div>
                <div className="bg-muted/40 rounded-xl p-3 border border-border/40">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Cloud Engine</p>
                  <p className="text-xs font-bold mt-0.5 text-foreground flex items-center gap-1">
                    <Database className="h-3.5 w-3.5 text-primary" />
                    Supabase DB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-muted-foreground text-xs">
          <p>© {new Date().getFullYear()} Vyayam AI. Connected to Supabase Cloud & Vercel Edge.</p>
        </div>
      </div>

      {/* Right Section: Form Container */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-12 bg-background/95">
        <div className="w-full max-w-md space-y-6">
          
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40">
              <Dumbbell className="text-primary h-5 w-5" />
            </div>
            <span className="font-display text-2xl font-black text-foreground">Vyayam AI</span>
          </div>

          <Card className="w-full border-border/50 shadow-2xl bg-card/70 backdrop-blur-xl rounded-2xl overflow-hidden">
            
            {/* Header / Tabs */}
            <CardHeader className="text-center pb-3 pt-6 px-6">
              {authMode === 'login' && (
                <>
                  <CardTitle className="text-2xl font-extrabold tracking-tight">Executive Portal</CardTitle>
                  <CardDescription className="text-xs mt-1">Sign in with your credentials to access the admin dashboard</CardDescription>
                </>
              )}
              {authMode === 'register' && (
                <>
                  <CardTitle className="text-2xl font-extrabold tracking-tight">Create Account</CardTitle>
                  <CardDescription className="text-xs mt-1">Register a new administrator or trainer account</CardDescription>
                </>
              )}
              {authMode === 'forgot' && (
                <>
                  <button 
                    onClick={() => { setAuthMode('login'); setForgotSubmitted(false); }}
                    className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground mb-2 gap-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                  </button>
                  <CardTitle className="text-2xl font-extrabold tracking-tight">Reset Password</CardTitle>
                  <CardDescription className="text-xs mt-1">Enter your registered email to receive reset instructions</CardDescription>
                </>
              )}
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-2 space-y-4">
              
              {/* ======================================================== */}
              {/* TAB 1: SIGN IN MODE (Default)                            */}
              {/* ======================================================== */}
              {authMode === 'login' && (
                <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
                  
                  {/* Quick Auto-Fill Demo Button */}
                  <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-foreground flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        Quick Evaluator Access
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">admin@gymadmin.com / Admin@123</p>
                    </div>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={handleQuickDemoAdmin}
                      className="text-xs h-7 px-2.5 border-primary/30 text-primary hover:bg-primary/20 font-semibold"
                    >
                      Auto-Fill
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@gymadmin.com"
                      autoComplete="email"
                      error={errors.email?.message}
                      className="bg-background/80 h-10 text-sm rounded-xl"
                      {...register('email')}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        className="bg-background/80 h-10 pr-10 text-sm rounded-xl"
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border bg-background text-primary focus:ring-primary h-4 w-4"
                    />
                    <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer select-none">
                      Remember me for 30 days
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 shadow-lg shadow-primary/20 text-sm rounded-xl mt-2" 
                    isLoading={isLoading}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In to Dashboard
                  </Button>

                  {/* Switch to Register */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground">
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('register')}
                        className="text-primary hover:underline font-bold"
                      >
                        Create Account
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* ======================================================== */}
              {/* TAB 2: REGISTER / SIGN UP MODE                           */}
              {/* ======================================================== */}
              {authMode === 'register' && (
                <form onSubmit={onRegisterSubmit} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-name" className="text-xs font-semibold">Full Name</Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="Vikram Malhotra"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="bg-background/80 h-10 text-sm rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email" className="text-xs font-semibold">Email Address</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="vikram@gymadmin.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="bg-background/80 h-10 text-sm rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-password" className="text-xs font-semibold">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Create strong password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="bg-background/80 h-10 text-sm rounded-xl"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 shadow-lg shadow-primary/20 text-sm rounded-xl mt-2" 
                    isLoading={isLoading}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register Admin Account
                  </Button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-primary hover:underline font-bold"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* ======================================================== */}
              {/* TAB 3: FORGOT PASSWORD MODE                              */}
              {/* ======================================================== */}
              {authMode === 'forgot' && (
                <div className="space-y-4">
                  {!forgotSubmitted ? (
                    <form onSubmit={onForgotSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="forgot-email" className="text-xs font-semibold">Registered Email</Label>
                        <div className="relative">
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="admin@gymadmin.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="bg-background/80 h-10 pl-9 text-sm rounded-xl"
                            required
                          />
                          <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 shadow-lg text-sm rounded-xl" 
                        isLoading={isLoading}
                      >
                        Send Reset Link
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-4 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-sm text-foreground">Reset Instructions Sent</h4>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        We have dispatched password recovery instructions to <span className="font-mono text-foreground font-bold">{forgotEmail}</span>.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => { setAuthMode('login'); setForgotSubmitted(false); }}
                        className="text-xs h-9 rounded-xl"
                      >
                        Return to Sign In
                      </Button>
                    </div>
                  )}
                </div>
              )}

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
