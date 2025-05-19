import Link from "next/link"
import type { LinkProps } from "next/link"
import type React from "react"

interface StartButtonProps extends LinkProps {
  className?: string
  children?: React.ReactNode
}

export function StartButton({ className = "", children = "Start", ...props }: StartButtonProps) {
  return (
    <Link {...props} className={`inline-block relative group ${className}`}>
      <svg
        width="140"
        height="40"
        viewBox="0 0 164 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform group-hover:scale-105"
      >
        <g clipPath="url(#clip0_2_21)">
          <path
            d="M0 0.105469L183 7.39001e-06C183.022 38.0821 158.149 69.0143 127.49 69.032L0.0397641 69.1055L0 0.105469Z"
            fill="#185047"
            className="group-hover:fill-[#124037] transition-colors"
          />
        </g>
        <defs>
          <clipPath id="clip0_2_21">
            <rect width="183" height="69" fill="white" transform="translate(0 0.105469) rotate(-0.0330191)" />
          </clipPath>
        </defs>
      </svg>
      <span className="absolute inset-1 flex items-center justify-center text-white text-base font-medium">
        {children}
      </span>
    </Link>
  )
}
