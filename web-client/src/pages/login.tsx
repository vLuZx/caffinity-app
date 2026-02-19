import Button from "@/components/button";
import TextField from "@/components/textfield";
import { useState } from "react";
import "../styles/authform.css";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        // Handle login logic here
    };

    return (
        <form className="w-auth-form max-w-100 justify-center items-center content-center" onSubmit={handleSubmit}>
            <TextField label="Email" value={email} onChange={setEmail} />
            <TextField label="Password" type="password" value={password} onChange={setPassword} />
            <Button>
                Sign in
            </Button>
        </form>
    );
}
