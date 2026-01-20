import { AuthContextProvider, useAuth } from "@/context/authContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function MainLayout() {
  return (
    <AuthContextProvider>
      <LayoutContent />
    </AuthContextProvider>
  );
}

function LayoutContent() {
  const { loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const currentRoute = segments[0];
    
    // Only allow navigation after auth state is loaded
    if (loading) return;

    // Allow signup and signin routes regardless of auth state
    if (currentRoute === "signup" || currentRoute === "signin" || currentRoute === undefined) {
      return;
    }
    
  }, [loading, segments, router]);

  return <Slot />;
}
