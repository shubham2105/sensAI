import { Progress } from "@/components/ui/progress";
import React, { Suspense } from "react";

const Layout = ({ children }) => {
  return (
    <div className="px-5">
      <Suspense
        fallback={<Progress className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
};

export default Layout;
