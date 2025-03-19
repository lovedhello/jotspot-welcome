
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast({
        title: "Password reset link sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow mt-16 sm:mt-24">
        <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-medium text-espresso">Reset Password</h1>
            <p className="text-taupe mt-2">We'll send you a link to reset your password</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg card-shadow">
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-espresso">Check your email</h3>
                <p className="text-taupe">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
                <p className="text-sm text-taupe">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="text-clay hover:text-espresso button-transition"
                  >
                    try again
                  </button>
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center text-espresso hover:text-clay button-transition mt-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-espresso">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-taupe" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-espresso hover:bg-clay"
                >
                  {isLoading ? 'Sending link...' : 'Send reset link'}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-espresso hover:text-clay button-transition"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
