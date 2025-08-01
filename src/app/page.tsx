import { AuthForm } from '@/components/auth/auth-form';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="text-center">
          <Logo />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">
            Welcome to Recoverantastic
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your anonymous and supportive path to recovery.
          </p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
