import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
   <div className="text-5xl text-green-400">Landing Page
   
   <div>
    <Link href="/sign-in">
    <Button>
      Login
    </Button>
    </Link>
    <Link href="/sign-up">
    <Button>
      Login
    </Button>
    </Link>
   </div>
   </div>
  );
}
