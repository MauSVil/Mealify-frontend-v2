import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col justify-center items-center w-full">
      {children}
    </div>
  )
};

export default PublicLayout;