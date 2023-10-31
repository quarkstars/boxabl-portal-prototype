"use client";
import { Label } from "@radix-ui/react-label";
import React, { useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Login = () => {
	const router = useRouter();
	const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const payload = {
			email: emailRef.current?.value,
			password: passwordRef.current?.value,
		};

		try {
			const result = await fetch(`${API_HOST}/api/auth/login/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			console.log(result);
			if (result) {
				const data = await result.json();
				router.push(`/dashboard?token=${data.token}`);
			}

			console.log(result);
		} catch (error) {
			alert("Error logging in");
			// TODO: handle error
		}
	};
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	return (
		<div className="space-y-2">
			<form onSubmit={onSubmit}>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						placeholder="m@example.com"
						required
						type="email"
						ref={emailRef}
					/>
				</div>
				<div className="pb-6 space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input id="password" required type="password" ref={passwordRef} />
				</div>
				<Button className="w-full" size="lg" type="submit">
					Login
				</Button>
			</form>
			<div className="flex justify-center w-full text-xs text-gray-500">
				Privacy Policy and Terms of Service
			</div>
		</div>
	);
};

export default Login;
