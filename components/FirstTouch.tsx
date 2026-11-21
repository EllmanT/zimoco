"use client";
import { useEffect } from "react";
import { captureFirstTouch } from "@/lib/attribution";

export default function FirstTouch() {
  useEffect(() => captureFirstTouch(), []);
  return null;
}
