
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/icons";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/data";

function PasswordValidationRule({ text, valid }: { text: string, valid: boolean }) {
    return (
        <div className="flex items-center text-sm">
            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${valid ? 'bg-green-500' : 'bg-muted'}`}></div>
            <span className={valid ? 'text-foreground' : 'text-muted-foreground'}>{text}</span>
        </div>
    );
}

export default function SignupPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const validations = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Passwords do not match.",
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/accounts/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    username,
                    email,
                    password,
                    password2: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('tokens', JSON.stringify(data.tokens));
                
                window.dispatchEvent(new Event('storage'));

                toast({
                    title: "Registration Successful",
                    description: "Welcome! Your account has been created.",
                });
                router.push('/dashboard');
            } else {
                 const errorMessage = Object.values(data).flat().join(' ');
                 toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: errorMessage || "An unknown error occurred.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-headline">Create an Account</CardTitle>
            <CardDescription>Join Schengen visa gateway to start your journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="first-name">First Name <span className="text-red-500">*</span></label>
                        <Input id="first-name" placeholder="First name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isLoading}/>
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="last-name">Last Name <span className="text-red-500">*</span></label>
                        <Input id="last-name" placeholder="Last name" required value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isLoading}/>
                    </div>
                </div>

                <div className="space-y-1 relative">
                    <label htmlFor="username">Username <span className="text-red-500">*</span></label>
                    <User className="absolute left-3 top-9 h-5 w-5 text-muted-foreground" />
                    <Input id="username" placeholder="Choose a username" required className="pl-10" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading}/>
                </div>
                
                <div className="space-y-1 relative">
                    <label htmlFor="email">Email Address <span className="text-red-500">*</span></label>
                    <Mail className="absolute left-3 top-9 h-5 w-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="Enter your email address" required className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
                </div>
                
                <div className="space-y-1 relative">
                    <label htmlFor="password">Password <span className="text-red-500">*</span></label>
                    <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Create a strong password" required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        disabled={isLoading}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-muted-foreground">
                        {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </button>
                </div>

                <div className="space-y-1 relative">
                    <label htmlFor="confirm-password">Confirm Password <span className="text-red-500">*</span></label>
                     <Input 
                        id="confirm-password" 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirm your password" required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                        disabled={isLoading}
                    />
                     <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-8 text-muted-foreground">
                        {showConfirmPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </button>
                </div>

                <div className="p-4 bg-secondary/30 rounded-md space-y-2">
                    <p className="text-sm font-medium">Password must contain:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                        <PasswordValidationRule text="At least 8 characters" valid={validations.length} />
                        <PasswordValidationRule text="One uppercase letter" valid={validations.uppercase} />
                        <PasswordValidationRule text="One lowercase letter" valid={validations.lowercase} />
                        <PasswordValidationRule text="One number" valid={validations.number} />
                    </div>
                </div>

                 <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div>
              <Button variant="outline" className="w-full">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
            </div>

          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
