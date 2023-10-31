"use client";

import Image from "next/image";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { Button } from "ui";
import * as Dialog from "@radix-ui/react-dialog";
import InvestModal from "../../components/invest-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { numberWithCommas, sumArrayProperty } from "../../lib/utils";

export default function DashboardPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [user, setUser] = useState<any>(null);
	const [submitTransactionCount, setSubmitTransactionCount] =
		useState<number>(0);
	const [open, setOpen] = useState(false);
	const [transactions, setTransactions] = useState<any[] | null>(null);
	const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

	const getUser = async (token: string) => {
		try {
			const result = await fetch(`${API_HOST}/api/auth/users/${token}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (result) {
				const data = await result.json();
				setUser(data);
			}
		} catch (error) {
			alert("Error getting user");
			// TODO: handle error
		}
	};

	useEffect(() => {
		const token = searchParams.get("token");
		if (token) {
			getUser(token);
		} else {
			router.push("/");
		}
	}, [window]);

	const getTransactions = async (token: string) => {
		if (!user?._id) return;
		try {
			const result = await fetch(
				`${API_HOST}/api/transactions/users/${user?._id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (result) {
				const data = await result.json();
				setTransactions(data);
			}
		} catch (error) {
			alert("Error getting transactions");
			// TODO: handle error
		}
	};

	useEffect(() => {
		if (user?._id) {
			getTransactions(user?._id);
		}
	}, [user, submitTransactionCount]);

	let username = "Welcome";
	let initials = "";
	if (user?.firstName?.[0] && user?.lastName?.[0]) {
		username = user?.firstName + " " + user?.lastName;
		initials = user?.firstName[0] + user?.lastName[0];
	}

	return (
		<div className="flex flex-col h-screen">
			<header className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b bg-blue-950">
				<div className="flex items-center space-x-4 text-white">
					<Image
						alt="Boxabl"
						src="/boxabl.svg"
						width={120}
						height={40}
						className="mx-auto"
					/>
					<span className="text-lg font-semibold">Investor Portal</span>
				</div>
			</header>
			<main className="flex flex-col p-4 space-y-4">
				<div className="flex items-center space-x-2">
					<Avatar>
						<AvatarImage alt="User Avatar" src="/placeholder-user.jpg" />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium">{username}</span>
						{/* <Badge variant="secondary">Accredited</Badge> */}
					</div>
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					<Card className="border-t-2 border-t-primary">
						<CardHeader>
							<CardTitle>Approved Shares</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="text-2xl font-bold">
								{numberWithCommas(
									sumArrayProperty("shares", transactions, "status", "Approved")
								)}
							</div>
							<div className="text-sm text-gray-500">{`${numberWithCommas(
								sumArrayProperty(
									"dollarAmount",
									transactions,
									"status",
									"Approved"
								)
							)} Invested`}</div>
						</CardContent>
					</Card>
					<Card className="border-t-2 border-t-gray-300">
						<CardHeader>
							<CardTitle>Pending Shares</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{numberWithCommas(
									sumArrayProperty("shares", transactions, "status", "Pending")
								)}
							</div>
							<div className="text-sm text-gray-500">{`$${numberWithCommas(
								sumArrayProperty(
									"dollarAmount",
									transactions,
									"status",
									"Pending"
								)
							)} Committed`}</div>
						</CardContent>
					</Card>
					<Dialog.Root open={open} onOpenChange={setOpen}>
						<Dialog.Trigger className="w-full">
							<Button className="flex items-center justify-center w-full h-full border-b-4 rounded-lg cursor-pointer bg-primary hover:bg-amber-500 border-b-secondary focus:border-b focus:border-secondary focus:border">
								<CardContent className="flex flex-col items-center">
									<div className="font-bold text-7xl">+</div>
									<CardTitle className="font-bold">Invest Now</CardTitle>
								</CardContent>
							</Button>
						</Dialog.Trigger>
						<InvestModal
							isCurrentInvestor={true}
							isAccredited={true}
							userId={user?._id}
							setSubmitTransactionCount={setSubmitTransactionCount}
							setOpen={setOpen}
						/>
					</Dialog.Root>
				</div>
				<div className="flex">
					<div className="hidden w-full overflow-auto lg:flex">
						<table className="w-full text-left border-collapse">
							<thead className="bg-blue-950">
								<tr>
									<th className="p-2 border-b border-gray-200 bg-gray-50">
										Transaction ID
									</th>
									<th className="p-2 border-b border-gray-200 bg-gray-50">
										Shares
									</th>
									<th className="p-2 border-b border-gray-200 bg-gray-50">
										Invested
									</th>
									<th className="p-2 border-b border-gray-200 bg-gray-50">
										Date
									</th>
									<th className="p-2 border-b border-gray-200 bg-gray-50">
										Notes
									</th>
									<th className="p-2 border-b border-gray-200 bg-gray-50">
										Status
									</th>
								</tr>
							</thead>
							<tbody>
								{transactions &&
									transactions?.map((transaction) => {
										return (
											<tr key={transaction?.id}>
												<td className="p-2 border-b">{transaction?.id}</td>
												<td className="p-2 border-b">
													{numberWithCommas(transaction?.shares)}
												</td>
												<td className="p-2 border-b">{`$${numberWithCommas(
													transaction?.dollarAmount
												)}`}</td>
												<td className="p-2 border-b">{`${transaction?.date?.substring(
													0,
													10
												)}`}</td>
												<td className="p-2 text-xs border-b">
													{`${transaction?.note ? transaction?.note : ""}`}
												</td>
												<td className="p-2 border-b">
													<Badge
														className={
															transaction?.status !== "Approved"
																? "bg-gray-200"
																: ""
														}
													>{`${transaction?.status}`}</Badge>
												</td>
											</tr>
										);
									})}
							</tbody>
						</table>
					</div>
					<div className="flex w-full lg:hidden">
						<Card className="w-full border-t-2 border-t-blue-950">
							<CardHeader>
								<CardTitle>My Investments</CardTitle>
							</CardHeader>
							<CardContent>
								{transactions &&
									transactions?.map((transaction) => {
										return (
											<>
												<div
													className="flex items-center justify-between pt-4 pb-0"
													key={transaction?.id}
												>
													<div className="flex items-center justify-center gap-2">
														<span className="text-lg font-medium">{`${numberWithCommas(
															transaction?.shares
														)} Shares`}</span>
														<Badge
															className={
																transaction?.status !== "Approved"
																	? "bg-gray-200"
																	: ""
															}
														>{`${transaction?.status}`}</Badge>
													</div>
													<span className="font-medium">{`$${numberWithCommas(
														transaction?.dollarAmount
													)} Invested`}</span>
												</div>
												<div className="flex items-center justify-between py-2 pb-4 text-sm text-gray-500 border-b">
													<span className="block">{`${`${transaction?.date?.substring(
														0,
														10
													)}`}} (ID ${transaction?.id}`}</span>
													<span></span>
												</div>
											</>
										);
									})}
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
