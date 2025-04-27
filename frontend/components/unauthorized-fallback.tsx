import Link from "next/link";
import { Button } from "./ui/button";

export default function UnauthorizedFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Authorization Required</h1>
        <div className="mb-6 text-slate-600">
          <p className="mb-2">
            You need to be signed in to access this content.
          </p>
          <p>
            Please sign in to your account or register if you don&apos;t have one.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}