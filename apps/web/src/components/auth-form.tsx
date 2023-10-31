"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Login from "./login";
import NewAccount from "./new-account";

const AuthForm = () => {
	return (
		<Tabs
			defaultValue="current"
			className="flex flex-col items-center w-full h-full space-y-6"
		>
			<div className="flex items-center space-between">
				<TabsList>
					<TabsTrigger value="current" className="relative cursor-pointer">
						Current Investor
					</TabsTrigger>
					<TabsTrigger value="new" className="cursor-pointer">
						New Investor
					</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="current" className="w-full">
				<Login />
			</TabsContent>
			<TabsContent value="new" className="w-full">
				<NewAccount />
			</TabsContent>
		</Tabs>
	);
};

export default AuthForm;
