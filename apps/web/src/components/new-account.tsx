"use client";
import { Label } from "@radix-ui/react-label";
import React, { useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useRouter } from "next/navigation";
const NewAccount = () => {
	const router = useRouter();

	const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

	const firstNameRef = useRef<HTMLInputElement>(null);
	const lastNameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const phoneRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [isCanadian, setIsCanadian] = React.useState(false);
	const [isAccredited, setIsAccredited] = React.useState(false);

	const onSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();

		const payload = {
			firstName: firstNameRef.current?.value,
			lastName: lastNameRef.current?.value,
			email: emailRef.current?.value,
			phoneNumber: Number(phoneRef.current?.value),
			password: passwordRef.current?.value,
			isCanadian,
			isAccredited,
		};

		try {
			const result = await fetch(`${API_HOST}/api/auth/signup/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			console.log(result);
			if (result) {
				const data = await result.json();
				// localStorage.setItem("token", result.data.token);
				router.push(`/dashboard?token=${data.token}`);
			}

			console.log(result);
		} catch (error) {
			alert("Error creating account");
			// TODO: handle error
		}
	};

	return (
		<div>
			<form onSubmit={onSubmit} className="space-y-2">
				{/* ... (your other form fields here) ... */}
				<div className="space-y-2">
					<Label htmlFor="name">First Name</Label>
					<Input ref={firstNameRef} id="name" required type="text" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="name">Last Name</Label>
					<Input ref={lastNameRef} id="name" required type="text" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						ref={emailRef}
						id="email"
						placeholder="m@example.com"
						required
						type="email"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Phone Number</Label>
					<Input
						ref={phoneRef}
						id="phone"
						placeholder="(000) 000-0000"
						required
						type="tel"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Create a Password</Label>
					<Input ref={passwordRef} id="password" required type="password" />
				</div>
				<Label htmlFor="acreditted" className="flex items-center gap-2 pt-2">
					<Switch
						id="acreditted"
						checked={isAccredited}
						onCheckedChange={(checked) => setIsAccredited(checked)}
					/>
					I am an acreditted investor
				</Label>
				<Label htmlFor="canada" className="flex items-center gap-2 py-2">
					<Switch
						id="canada"
						checked={isCanadian}
						onCheckedChange={(checked) => {
							setIsCanadian(checked);
						}}
					/>
					I am a resident of Canada
				</Label>
				<Button className="w-full" size="lg" type="submit">
					Create Investor Account
				</Button>
				<div className="flex justify-center w-full pt-2 text-xs text-gray-500">
					Privacy Policy and Terms of Service
				</div>
			</form>
		</div>
	);
};

export default NewAccount;
