"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      theme="light"
      offset={16}
      mobileOffset={{ top: 12 }}
      containerAriaLabel="Avisos"
      toastOptions={{
        style: {
          borderRadius: "1rem",
          fontFamily: "inherit",
        },
      }}
    />
  );
}
