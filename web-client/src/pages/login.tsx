import Button from "@/components/button";
import { AuthDivider, AuthForm, AuthSocialButtons } from "@/components/authform";
import TextField from "@/components/textfield";
import { useState } from "react";
import { APP } from "@/config/app";

export default function LoginPage() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        // handle login logic here
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <AuthForm
                className="max-w-105 space-y-4"
                onSubmit={handleSubmit}
                title={<>Sign in to {APP.name}</>}
            >

                <TextField
                    leftLabelText="Username or email address"
                    value={emailOrUsername}
                    onChange={setEmailOrUsername}
                />

                <TextField
                    leftLabelText="Password"
                    rightLabelNode={
                        <Button variant="text-only" to="/forgot-password" className="text-sm font-medium">
                            Forgot password?
                        </Button>
                    }
                    type="password"
                    value={password}
                    onChange={setPassword}
                />

                <Button stretch>Sign in</Button>

                <AuthDivider />

                <AuthSocialButtons
                    googleLabel="Continue with Google"
                    appleLabel="Continue with Apple"
                    buttonClassName="py-3"
                />

                <div className="flex justify-center pt-2">
                    <p className="text-sm">New to {APP.name}?&nbsp;</p>
                    <Button variant="text-only" to="/register" className="text-sm">
                        Create an account
                    </Button>
                </div>
            </AuthForm>
        </div>
    );
}