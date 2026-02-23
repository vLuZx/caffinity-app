import { useEffect, useState } from "react";

import "../styles/textfield.css";

type TextFieldProps = {
    rightLabelText?: string;
    leftLabelText?: string;
    rightLabelNode?: React.ReactNode;
    leftLabelNode?: React.ReactNode;
    placeholder?: string;
    type?: string;
    value: string;
    hoverColor?: string;
    required?: boolean;

    onChange: (value: string) => void;

    validationFn?: (value: string) => ValidationCheck;
    validationOut?: (valid: boolean) => void;
    isFocusedOut?: (focused: boolean) => void;
    hasBeenFocusedOut?: (hasBeenFocused: boolean) => void;
    isErrorOut?: (isError: boolean) => void;
};

export default function TextField({
    rightLabelText,
    leftLabelText,
    rightLabelNode,
    leftLabelNode,
    placeholder = "",
    type = "text",
    value,
    hoverColor = "var(--primary-accent)",
    required = false,
    onChange,
    validationFn,
    validationOut,
    isFocusedOut,
    hasBeenFocusedOut,
    isErrorOut,
}: TextFieldProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasBeenFocused, setHasBeenFocused] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const evaluateField = (inputValue: string, touched: boolean) => {
        const trimmedValue = inputValue.trim();
        const requiredFailed = required && touched && trimmedValue.length === 0;

        const validationResult = validationFn?.(inputValue);
        const validationFailed = touched && Boolean(validationResult && !validationResult.passed);

        const nextIsError = requiredFailed || validationFailed;
        const nextErrorMessage = requiredFailed
            ? "This field is required"
            : validationFailed
                ? (validationResult?.errorMessage ?? "Invalid value")
                : "";

        const nextIsValid =
            (!required || trimmedValue.length > 0) &&
            (!validationResult || validationResult.passed);

        setIsError(nextIsError);
        setErrorMessage(nextErrorMessage);
        validationOut?.(nextIsValid);
        isErrorOut?.(nextIsError);
    };

    const handleFocus = () => {
        setIsFocused(true);
        isFocusedOut?.(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        isFocusedOut?.(false);

        if (!hasBeenFocused) {
            setHasBeenFocused(true);
            hasBeenFocusedOut?.(true);
            evaluateField(value, true);
            return;
        }

        evaluateField(value, hasBeenFocused);
    };

    const handleChange = (nextValue: string) => {
        onChange(nextValue);
        evaluateField(nextValue, hasBeenFocused);
    };

    useEffect(() => {
        evaluateField(value, hasBeenFocused);
    }, [value, hasBeenFocused, required, validationFn]);

    return (
        <div>
            <div className="flex items-center justify-between w-full py-1">
                {leftLabelText && (
                    <div>
                        <label className="text-sm font-medium text-left">{leftLabelText}</label>
                        {required && <span className="text-xs">*</span>}
                    </div>
                )}
                {leftLabelNode}
                {rightLabelText && (
                    <div>
                        <label className="text-sm font-medium text-right">{rightLabelText}</label>
                        {required && <span className="text-xs">*</span>}
                    </div>
                )}
                {rightLabelNode}
            </div>
            <input
                className={`w-auth-input ${(isError && !isFocused) && "outline-(--error)!"}`}
                style={{ ["--hover-color" as any]: hoverColor }}
                type={type}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                aria-invalid={isError}
                data-focused={isFocused}
            />
            {!isFocused && isError && errorMessage && (
                <p className="pt-1 text-xs text-(--error)">{errorMessage}</p>
            )}
        </div>
    );
}
