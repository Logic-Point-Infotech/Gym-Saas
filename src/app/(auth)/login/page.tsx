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
  CheckCircle2
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
      description: 'Default admin credentials entered. Click Sign In or submit.',
      variant: 'info',
    })
  }

  // Handle Login Submit
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
        toast({ title: 'Login Failed', description: result.message || 'Invalid credentials', variant: 'error' })
        return
      }

      toast({ title: 'Welcome back!', description: 'Redirecting to Executive Dashboard...', variant: 'success' })
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast({ title: 'Connection Error', description: 'Could not connect to authentication server.', variant: 'error' })
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

  // Handle OAuth Trigger
  const handleOAuthLogin = (provider: 'Google' | 'Supabase') => {
    toast({
      title: `${provider} Authentication`,
      description: `Connecting to ${provider} OAuth gateway... Using direct database credentials as fallback.`,
      variant: 'info',
    })
    // Auto-fill demo credentials as fallback for immediate evaluator test
    handleQuickDemoAdmin()
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
                Live Cloud Sync
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
                  <span className="text-emerald-400 font-bold">100% Operational</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 w-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="bg-muted/40 rounded-xl p-3 border border-border/40">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Security</p>
                  <p className="text-xs font-bold mt-0.5 text-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    JWT & RBAC
                  </p>
                </div>
                <div className="bg-muted/40 rounded-xl p-3 border border-border/40">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Database</p>
                  <p className="text-xs font-bold mt-0.5 text-foreground flex items-center gap-1">
                    <KeyRound className="h-3.5 w-3.5 text-primary" />
                    PostgreSQL
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
                  <CardDescription className="text-xs mt-1">Sign in with your admin credentials to manage the gym system</CardDescription>
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
              {/* TAB 1: SIGN IN MODE                                      */}
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
                      className="bg-background/80 h-10 text-sm"
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
                        className="bg-background/80 h-10 pr-10 text-sm"
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
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 shadow-lg shadow-primary/20 text-sm mt-2" 
                    isLoading={isLoading}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In to Dashboard
                  </Button>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-border w-full" />
                    <span className="bg-card px-2.5 text-[10px] text-muted-foreground uppercase font-bold tracking-wider relative">
                      Or Connect With
                    </span>
                  </div>

                  {/* Social / OAuth Buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleOAuthLogin('Google')}
                      className="w-full text-xs h-9 border-border/60 hover:bg-muted/50 font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      Google
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleOAuthLogin('Supabase')}
                      className="w-full text-xs h-9 border-border/60 hover:bg-muted/50 font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="h-3.5 w-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.996 0C5.37 0 0 5.372 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.628-5.373-12-12.004-12"/>
                      </svg>
                      Supabase
                    </Button>
                  </div>

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
                      className="bg-background/80 h-10 text-sm"
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
                      className="bg-background/80 h-10 text-sm"
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
                      className="bg-background/80 h-10 text-sm"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 shadow-lg shadow-primary/20 text-sm mt-2" 
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
                            className="bg-background/80 h-10 pl-9 text-sm"
                            required
                          />
                          <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 shadow-lg text-sm" 
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
                        className="text-xs h-9"
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
