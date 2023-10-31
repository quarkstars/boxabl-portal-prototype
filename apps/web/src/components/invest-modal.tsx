import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import {
	costPerShare,
	currentBonusPercent,
	getAmountBonusPercent,
	getRoundBonusPercent,
} from "lib";
import { numberWithCommas } from "../lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";

interface InvestModalProps {
	isAccredited: boolean;
	isCurrentInvestor: boolean;
	userId?: string;
	setSubmitTransactionCount: React.Dispatch<React.SetStateAction<number>>;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InvestModal({
	isAccredited, //TODO: Does this affect shares?
	isCurrentInvestor,
	userId,
	setOpen,
	setSubmitTransactionCount,
}: InvestModalProps) {
	const DOLLAR_DEFAULT = 50000;
	const [dollar, setDollar] = React.useState(DOLLAR_DEFAULT);
	const [shares, setShares] = React.useState(DOLLAR_DEFAULT * costPerShare);

	const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

	interface Bonuses {
		roundBonus: number | null;
		amountBonus: number;
		roundShares: number;
		amountShares: number;
		totalShares: number;
		totalBonus: number;
		currentBonus: number;
		currentShares: number;
	}

	const getCurrentBonus = (dollarAmount: number) => {
		return {
			roundBonus: getRoundBonusPercent(),
			amountBonus: getAmountBonusPercent(dollarAmount),
			roundShares: getAmountBonusPercent(
				dollarAmount * (getRoundBonusPercent() || 0)
			),
			amountShares: getAmountBonusPercent(dollarAmount) * dollarAmount,
			totalShares:
				getAmountBonusPercent(dollarAmount * (getRoundBonusPercent() || 0)) +
				getAmountBonusPercent(dollarAmount) * dollarAmount +
				(isCurrentInvestor ? currentBonusPercent * dollarAmount : 0),
			totalBonus:
				(getRoundBonusPercent() || 0) +
				getAmountBonusPercent(dollarAmount) +
				(isCurrentInvestor ? currentBonusPercent : 0),
			currentBonus: isCurrentInvestor ? currentBonusPercent : 0,
			currentShares: isCurrentInvestor ? currentBonusPercent * dollarAmount : 0,
		};
	};

	const [bonuses, setBonuses] = useState<Bonuses>(
		getCurrentBonus(DOLLAR_DEFAULT)
	);

	const updateDollar = (value: number) => {
		setDollar(value);
		const currentBonus = getCurrentBonus(value);
		setBonuses(currentBonus);
		setShares(value * costPerShare + currentBonus.totalShares);
	};

	const updateShares = (value: number) => {
		const currentDollar = Math.floor(value / costPerShare);
		setDollar(currentDollar);
		const currentBonus = getCurrentBonus(currentDollar);
		setBonuses(currentBonus);
		setShares(Math.floor(value) + currentBonus.totalShares);
	};

	const onSubmit = async (e: any): Promise<void> => {
		e.preventDefault();

		const payload = {
			shares: shares,
			dollarAmount: dollar,
			userId,
		};

		try {
			const result = await fetch(`${API_HOST}/api/transactions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			if (result) {
				const data = await result.json();
				//TODO: Close modal
				// router.push(`/dashboard?token=${data.token}`);
			}
			setSubmitTransactionCount((prev) => prev + 1);
			setOpen(false);
		} catch (error) {
			alert("Error creating transaction");
			// TODO: handle error
		}
	};

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle className="font-bold">Invest in Boxabl</DialogTitle>
				<DialogDescription>
					Join us in revolutionizing housing
				</DialogDescription>
			</DialogHeader>
			<div className="flex flex-col w-full pt-2 font-medium">
				<span>
					Get <span className="font-bold">bonus</span> shares when you
				</span>
				<div className="flex justify-between w-full py-2 border-t border-b">
					<span className="text-sm font-normal">Invest Again</span>
					<div className="flex items-center gap-2 text-xs font-normal text-gray-500">
						{`${bonuses.currentShares} shares`}
						<Badge>{`${bonuses.currentBonus * 100}%`}</Badge>
					</div>
				</div>
				<div className="flex justify-between w-full py-2 border-t border-b">
					<span className="text-sm font-normal">Invest Early</span>
					<div className="flex items-center gap-2 text-xs font-normal text-gray-500">
						{`${bonuses.roundShares} shares`}
						<Badge>{`${(bonuses.roundBonus || 0) * 100}%`}</Badge>
					</div>
				</div>
				<div className="flex justify-between w-full py-2 space-x-2 border-t border-b">
					<span className="text-sm font-normal">Invest More</span>
					<div className="flex items-center gap-2 text-xs font-normal text-gray-500">
						{`${bonuses.amountShares} shares`}
						<Badge>{`${bonuses.amountBonus * 100}%`}</Badge>
					</div>
				</div>
			</div>
			<div className="w-full pt-2">
				<Slider
					max={1000000}
					min={25000}
					step={1000}
					value={[dollar]}
					onValueChange={(value) => {
						updateDollar(value[0]);
					}}
				/>
			</div>
			<div className="grid grid-cols-2 gap-4 py-4">
				<div className="flex flex-col items-center col-span-1 gap-1">
					<Label className="text-right" htmlFor="amount">
						Investment
					</Label>
					<div className="flex items-center gap-1">
						<span className="font-bold text-gray-500">$</span>
						<Input
							className="w-full text-lg font-bold text-center"
							id="amount"
							placeholder="$25,000"
							value={numberWithCommas(dollar)}
							onChange={(e) => {
								if (
									e.target.value === "" ||
									Number.isNaN(Number(e.target.value.replace(/,/g, "")))
								)
									updateDollar(0);
								updateDollar(Number(e.target.value.replace(/,/g, "")));
							}}
						/>
					</div>
					<span className="text-xs text-gray-500">USD</span>
				</div>
				<div className="flex flex-col items-center col-span-1 gap-1">
					<Label className="text-right" htmlFor="amount">
						Shares
					</Label>
					<Input
						className="w-full text-lg font-bold text-center"
						id="amount"
						value={numberWithCommas(shares)}
						onChange={(e) => {
							if (
								e.target.value === "" ||
								Number.isNaN(Number(e.target.value.replace(/,/g, "")))
							)
								setShares(0);
							setShares(Number(e.target.value.replace(/,/g, "")));
						}}
						onBlur={(e) => {
							if (
								e.target.value === "" ||
								Number.isNaN(Number(e.target.value.replace(/,/g, "")))
							)
								updateShares(0);
							updateShares(Number(e.target.value.replace(/,/g, "")));
						}}
					/>
					<span className="text-xs text-gray-500">{`${numberWithCommas(
						bonuses.totalShares
					)} bonus shares added!`}</span>
				</div>
			</div>
			<DialogFooter>
				<DialogClose asChild>
					<Button type="submit" className="w-full" onClick={onSubmit}>
						Invest
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}
