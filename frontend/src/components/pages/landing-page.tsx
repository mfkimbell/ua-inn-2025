import AuthButton from "../auth/button";
import { useState } from "react";

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-12 items-center">
          <div className="w-full max-w-2xl text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              CGI Workplace Services
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Streamlining Office Supply Management
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Your one-stop platform for managing workplace requests, from
              office supplies to maintenance needs. Simple, efficient, and
              designed for CGI members.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Login to WorkSync
            </h2>
            <AuthButton toggleAuthModal={toggleAuthModal} />
            <div className="mt-6 text-center text-sm text-gray-500">
              Need help? Contact{" "}
              <a
                href="mailto:it@company.com"
                className="text-[#E31937] hover:text-[#c01731]"
              >
                IT Support
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
