import React from "react";
import { useSession } from "next-auth/react";
import LandingPage from "@/components/pages/landing-page";
import { LoggedInUser } from "@/components/pages/logged-in-user";
import useUser from "@/hooks/useUser";
import EmployeeView from "@/components/pages/employee-view";

export default function Home() {
  const { data: session } = useSession();
  const { user } = useUser();

  // if (!session) {
  //   return <LandingPage />;
  // }

  // if (user?.role === "admin") {
  //   return <AdminView />;
  // }

  // if (user?.role === "employee") {
  //   return 
  // }

  // return <LoggedInUser />;
  return <EmployeeView />;
}
