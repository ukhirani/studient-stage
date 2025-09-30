import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, CheckCircle } from "lucide-react";

interface VerificationBannerProps {
  profile: {
    role: string;
    is_verified?: boolean;
  } | null;
}

export function VerificationBanner({ profile }: VerificationBannerProps) {

  if (!profile || profile.role !== "recruiter") {
    return null;
  }

  if (profile.is_verified) {
    return (
      <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Your recruiter account is verified. You can now post opportunities.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 mb-6">
      <Clock className="h-4 w-4" />
      <AlertDescription>
        Your recruiter account is pending verification. A placement officer will review your registration soon. 
        You'll be able to post opportunities once verified.
      </AlertDescription>
    </Alert>
  );
}