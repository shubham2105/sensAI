import React from "react";

const MainLayout = async ({ children }) => {
  //redirct user to onboarding after signup if they are not already
  return <div className="container mx-auto mt-24 mb-20">{children}</div>;
};

export default MainLayout;
