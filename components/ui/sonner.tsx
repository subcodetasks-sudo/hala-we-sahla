"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      richColors
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5" strokeWidth={1.75} />,
        info: <InfoIcon className="size-5" strokeWidth={1.75} />,
        warning: <TriangleAlertIcon className="size-5" strokeWidth={1.75} />,
        error: <OctagonXIcon className="size-5" strokeWidth={1.75} />,
        loading: <Loader2Icon className="size-5 animate-spin" strokeWidth={1.75} />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "9999px",
          "--success-bg": "#1B8354",
          "--success-border": "#1B8354",
          "--success-text": "#ffffff",
          "--warning-bg": "#D97706",
          "--warning-border": "#D97706",
          "--warning-text": "#ffffff",
          "--error-bg": "var(--accent)",
          "--error-border": "var(--accent)",
          "--error-text": "#ffffff",
          "--width": "min(92vw, 28rem)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          success: "cn-toast-success",
          warning: "cn-toast-pending",
          loading: "cn-toast-pending",
          error: "cn-toast-error",
          icon: "cn-toast-icon",
          title: "cn-toast-title",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
