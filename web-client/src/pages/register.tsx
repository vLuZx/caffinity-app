import Button from "@/components/button";
import { AuthDivider, AuthForm, AuthSocialButtons } from "@/components/authform";
import TextField from "@/components/textfield";
import { useState } from "react";
import { APP } from "@/config/app";
import { validateEmail, validatePassword, validateUsername } from "@/validation/account-validation-functions";

export default function RegisterPage() {

  	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [isEmailValid, setIsEmailValid] = useState(false);
	const [isUsernameValid, setIsUsernameValid] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(false);

	const handleSubmit = () => {
		// handle login logic here
	};

	return (
		<div className="w-full min-h-screen grid items-center justify-center grid-cols-1 lg:grid-cols-2">
			<div className="hidden lg:block w-full h-full bg-(--secondary-accent)">

			</div>
			<div className="relative w-full h-full">
				<div className="w-full h-full flex flex-col">
					<div className="flex justify-end px-6 pt-5">
						<p className="text-md">Have an account?&nbsp;</p>
						<Button variant="text-only" to="/login" className="underline text-md">
							Sign in
						</Button>
					</div>
					<div className="flex-1 flex justify-center items-center">
						<AuthForm
							className="max-w-130 space-y-4"
							onSubmit={handleSubmit}
							title={
								<>
									Sign up for {APP.name}
								</>
							}
							titleClassName="text-left!"
						>
							<AuthSocialButtons
								googleLabel="Sign up with Google"
								appleLabel="Sign up with Apple"
								buttonClassName="py-2"
							/>

							<AuthDivider />

							<TextField
								leftLabelText="Email address"
								value={email}
								onChange={setEmail}
								validationFn={validateEmail}
								required
							/>
							<div>
								<TextField
									leftLabelText="Username"
									value={username}
									onChange={setUsername}
									validationFn={validateUsername}
									required
								/>
								<label className="text-xs text-(--text-muted)">
									Username may only contain alphanumeric characters, AND must be between 3 and 16 characters in length.
								</label>
							</div>
							<div>
								<TextField
									leftLabelText="Password"
									type="password"
									value={password}
									onChange={setPassword}
									validationFn={validatePassword}
									required
								/>
								<label className="text-xs text-(--text-muted)">
									Password should be at least 8 characters AND contain an uppercase and lowercase letter and a number.
								</label>
							</div>

							<Button stretch>
								Create account
							</Button>

							<div>
								<label className="text-xs text-(--text-muted)">
									By creating an account, you agree to the{" "}
									<a className="btn-text-only underline" href="/terms">
										Terms of Service
									</a>
									. For more information about {APP.name}'s privacy practices, see the{" "}
									<a className="btn-text-only underline" href="/privacy">
										{APP.name} Privacy Statement
									</a>
									.
								</label>
							</div>
						</AuthForm>
					</div>
				</div>
			</div>
		</div>
	);
}