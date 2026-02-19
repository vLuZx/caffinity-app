import type React from "react"
import "../styles/button.css"

type ButtonProps = {
    children?: React.ReactNode,
    
    textSize?: 'main' | 'small' | 'large',
    variant?: 'solid' | 'text-only' | 'outline',
    backgroundColor?: string,
    foreground?: string,
    stretch?: boolean

    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void

    isDisabled?: boolean,
}

export default function Button({
    children = <p>Click me</p>,
    textSize = 'main',
    variant = 'solid',
    backgroundColor = "var(--primary-accent)",
    foreground = "#ffffff",
    stretch = false,
    onClick,
    isDisabled,
}: ButtonProps) {
    return (
        <button
            className={`btn-${variant} ${stretch ? "w-full" : ""}`}
            style={{
                ["--btn-bg" as any]: backgroundColor,
                ["--btn-fg" as any]: foreground,
                ["--btn-text-size" as any]: `var(--text-size-${textSize})`,
            }}
            onClick={onClick}
            disabled={isDisabled}
        >
            {children}
        </button>
    )
}
