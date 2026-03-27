import React from "react";
import BottomNav from "../components/navigation/BottomNav";
import Header from "../components/navigation/Header";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
}

const MainLayout: React.FC<LayoutProps> = ({ children, title, showBack }) => {
  return (
    <div className="pb-20">
      <Header title={title} showBack={showBack} />
      <div className="px-4 pt-4">{children}</div>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
