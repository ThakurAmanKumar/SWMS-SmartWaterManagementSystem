"use client"

import { useState } from "react"

interface ToggleButtonProps {
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function ToggleButton({ defaultChecked = false, onCheckedChange }: ToggleButtonProps) {
  const [checked, setChecked] = useState(defaultChecked)

  const handleClick = () => {
    const newChecked = !checked
    setChecked(newChecked)
    onCheckedChange?.(newChecked)
  }

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
        checked ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  )
}