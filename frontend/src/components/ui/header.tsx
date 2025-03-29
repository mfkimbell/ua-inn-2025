// import Link from "next/link";
import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import AuthButton from "../auth/button";
// import AuthModal from "../auth/login-modal";
// import { useSession } from "next-auth/react";
// import { CreditBalance } from "./credit-balance";
// import Image from "next/image";
import AuthButton from "../auth/button";

const Header = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // const { data: session, status } = useSession();

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-3xl font-bold text-[#E31937]">Work</span>
          <span className="text-3xl font-bold text-gray-900">Sync</span>
        </div>
        <AuthButton toggleAuthModal={toggleAuthModal}/>
      </div>
    </header>
  );
};

export default Header;
