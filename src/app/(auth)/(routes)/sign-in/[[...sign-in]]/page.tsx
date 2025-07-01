import { SignIn } from '@clerk/nextjs'
import Image from 'next/image';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-colors">
      <div className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-xl bg-white/90 dark:bg-gray-900/90 flex flex-col items-center">
        <Image src="/assets/logo.png" alt="Zyntra Logo" width={56} height={56} className="mb-4 rounded-xl shadow" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6 text-center">Sign in to your Zyntra account</p>
        <SignIn appearance={{ elements: { card: 'shadow-none bg-transparent', formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white' } }} />
      </div>
    </div>
  );
}