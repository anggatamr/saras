"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface SarasLogoProps {
  className?: string
  iconSize?: "sm" | "md" | "lg"
  showText?: boolean
  textSize?: "sm" | "md" | "lg" | "xl"
}

export function SarasIcon({ 
  className, 
  size = "md" 
}: { 
  className?: string
  size?: "sm" | "md" | "lg" 
}) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-11 w-11 text-lg"
  }

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Background shadow card */}
      <div 
        className={cn(
          "absolute inset-0 translate-x-[3px] translate-y-[3px] border-2 border-foreground bg-accent rounded-none transition-transform"
        )} 
      />
      {/* Foreground main card */}
      <div 
        className={cn(
          "relative flex items-center justify-center border-2 border-foreground bg-primary font-black text-primary-foreground tracking-tighter rounded-none",
          sizeClasses[size]
        )}
      >
        S
      </div>
    </div>
  )
}

export function SarasLogo({ 
  className, 
  iconSize = "md", 
  showText = true,
  textSize = "md"
}: SarasLogoProps) {
  const textClasses = {
    sm: "text-md",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  }

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <SarasIcon size={iconSize} />
      {showText && (
        <span 
          className={cn(
            "font-display font-black tracking-tighter text-foreground uppercase relative",
            textClasses[textSize]
          )}
          style={{
            textShadow: "1.5px 1.5px 0px var(--accent)"
          }}
        >
          Saras
        </span>
      )}
    </div>
  )
}
