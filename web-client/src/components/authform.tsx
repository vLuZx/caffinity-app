import type React from "react";
import Button from "@/components/button";
import { FaApple, FaGoogle } from "react-icons/fa";
import "../styles/authform.css";

type AuthFormProps = {
    children?: React.ReactNode;
    className?: string;
    title?: React.ReactNode;
    titleClassName?: string;
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

type AuthSocialButtonsProps = {
    googleLabel: string;
    appleLabel: string;
    buttonClassName?: string;
};

export function AuthForm({
    children,
    className = "",
    title,
    titleClassName = "",
    onSubmit,
}: AuthFormProps) {
    const formClassName = ["auth-form w-full", className].filter(Boolean).join(" ");
    const resolvedTitleClassName = ["title", titleClassName].filter(Boolean).join(" ");

    return (
        <form className={formClassName} onSubmit={onSubmit}>
            {title && <p className={resolvedTitleClassName}>{title}</p>}
            {children}
        </form>
    );
}

export function AuthDivider() {
    return (
        <div className="divider">
            <hr />
            <span>or</span>
            <hr />
        </div>
    );
}

export function AuthSocialButtons({
    googleLabel,
    appleLabel,
    buttonClassName = "",
}: AuthSocialButtonsProps) {
    return (
        <>
            <Button
                background="var(--light-base)"
                foreground="var(--text-dark)"
                stretch
                className={buttonClassName}
            >
                <span className="flex items-center justify-center gap-2">
                    <FaGoogle className="w-5 h-5 shrink-0" />
                    <span>{googleLabel}</span>
                </span>
            </Button>

            <Button
                background="var(--light-base)"
                foreground="var(--text-dark)"
                stretch
                className={buttonClassName}
            >
                <span className="flex items-center justify-center gap-2">
                    <FaApple className="w-5 h-5 shrink-0" />
                    <span>{appleLabel}</span>
                </span>
            </Button>
        </>
    );
}
