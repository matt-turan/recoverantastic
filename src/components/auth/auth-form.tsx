'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HeartHandshake, Loader2 } from 'lucide-react';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24px"
      height="24px"
      {...props}
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.012,35.23,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

export function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<
    'google' | 'anonymous' | null
  >(null);

  const handleGoogleSignIn = async () => {
    setIsLoading('google');
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'Could not sign in with Google.',
      });
      setIsLoading(null);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsLoading('anonymous');
    const auth = getAuth();
    try {
      await signInAnonymously(auth);
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'Could not sign in anonymously.',
      });
      setIsLoading(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-center text-xl font-semibold">Sign In / Sign Up</h2>
      </CardHeader>

      <CardFooter className="flex flex-col gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={!!isLoading}
        >
          {isLoading === 'google' ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2" />
          )}
          Continue with Google
        </Button>
        <Separator className="my-2" />
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleAnonymousSignIn}
          disabled={!!isLoading}
        >
          {isLoading === 'anonymous' ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <HeartHandshake className="mr-2" />
          )}
          Continue Anonymously
        </Button>
      </CardFooter>
    </Card>
  );
}