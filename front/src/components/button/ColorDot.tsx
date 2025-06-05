import { FC } from "react"

interface ColorDotProps {
  color: string // tailwind color class (e.g. 'bg-blue-500')
  size?: number // px
  className?: string
}

export const ColorDot: FC<ColorDotProps> = ({ color, size = 12, className = "" }) => {
  return (
    <span
      className={`inline-block rounded-full ${color} ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
