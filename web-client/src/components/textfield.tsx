import { useState } from "react";

import "../styles/textfield.css";

type TextFieldProps = {
    label: string;
    placeholder?: string;
    type?: string;
    value: string;

    onChange: (value: string) => void;

    validationFn?: (value: string) => ValidationCheck;
    validationOut?: (valid: boolean) => void; 
};

export default function TextField({
    label,
    placeholder = "",
    type = "text",
    value,
    onChange,
    validationFn,
    validationOut
}: TextFieldProps) {

    const [isFocused, setIsFocused] = useState(false);

    return (
        <div>
            <label>{label}</label>
            <input
                className="w-auth-input"
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
}
