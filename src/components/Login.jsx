import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function Login({ setIsLoggedIn, setUser }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        setError(error.message);
      } else {
        // Set user and isLoggedIn in parent
        setUser(authData.user);
        setIsLoggedIn(true);
        navigate('/app/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b] p-4">
      <Card className="w-full max-w-md bg-[#23232a] border border-[#23232a] text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">Welcome back</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...form.register("email")}
                className={`bg-[#18181b] border border-[#23232a] text-white placeholder:text-gray-400 focus:border-white focus:ring-white ${
                  form.formState.errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...form.register("password")}
                  className={`bg-[#18181b] border border-[#23232a] text-white placeholder:text-gray-400 focus:border-[#ffd600] focus:ring-[#ffd600] pr-10 ${
                    form.formState.errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-[#23232a] text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 cursor-pointer hover:text-white hover:underline">
                Forgot password?
              </span>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-950/50 p-3 rounded-md border border-red-800">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            variant="outline"
            className="w-full bg-[#18181b] border border-[#23232a] text-white hover:bg-[#23232a] hover:text-white"
            onClick={() => navigate('/app/signup')}
          >
            Create account
          </Button>
          <div className="text-sm text-gray-400 text-center">
            New to Promptson?{' '}
            <a href="#" className="text-white hover:underline">Request access</a>
          </div>
          <div className="flex justify-center gap-6 text-xs text-gray-500 mt-2">
            <a href="#" className="hover:underline hover:text-white">Customer Centre</a>
            <a href="#" className="hover:underline hover:text-white">Terms</a>
            <a href="#" className="hover:underline hover:text-white">Privacy</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login; 