"use client";

import { useEffect } from "react";
import { BarberProfile } from "@/types";

interface Props {
  profile?: Partial<BarberProfile>;
}

export default function ThemeInjector({ profile }: Props) {
  useEffect(() => {
    if (profile?.primaryColor) {
      document.documentElement.style.setProperty("--color-primary", profile.primaryColor);
    }
    if (profile?.secondaryColor) {
      document.documentElement.style.setProperty("--color-secondary", profile.secondaryColor);
    }
  }, [profile?.primaryColor, profile?.secondaryColor]);

  return null;
}
