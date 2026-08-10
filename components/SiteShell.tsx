"use client";

import { ReactNode, useEffect } from "react";

type SiteShellProps = {
  children: ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/script.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return <>{children}</>;
}
