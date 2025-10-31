"use client";

import { useState } from "react";
import TopBar from "@/components/bars/topBar";
import Hero1 from "@/components/hero/Hero1";
import Hero2 from "@/components/hero/Hero2";
import Hero3 from "@/components/hero/Hero3";
import Hero4 from "@/components/hero/Hero4";
import Hero5 from "@/components/hero/Hero5";
import Footer from "@/components/bars/footer";
import RoleSelectionModal from "@/components/RoleSelectionModal";

const user = {
  name: "Simon Johnson",
  abbreviation: "SJ",
  userType: "student" as const,
  loggedIn: true,
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup">("signup");

  const openModal = (mode: "login" | "signup") => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  return (
    <>
      <TopBar
        theme="home"
        user={null}
        onLoginClick={() => openModal("login")}
      />
      <Hero1 onSignupClick={() => openModal("signup")} />
      <Hero2 />
      <Hero3 />
      <Hero4 />
      <Hero5 onSignupClick={() => openModal("signup")} />
      <Footer />
      <RoleSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
      />
    </>
  );
}
