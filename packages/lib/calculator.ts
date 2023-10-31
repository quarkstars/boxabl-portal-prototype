import {
	amountBonusPercents,
	costPerShare,
	currentBonusPercent,
	roundBonusPercents,
} from "./data/conversions";

export const getAmountBonusPercent = (amount: number) => {
	// Get the keys, convert them to numbers and sort them in descending order
	const thresholds = Object.keys(amountBonusPercents)
		.map(Number)
		.sort((a, b) => b - a);

	// Find the first threshold that is less than or equal to the amount
	for (let threshold of thresholds) {
		if (amount >= threshold) {
			return amountBonusPercents[
				String(threshold) as keyof typeof amountBonusPercents
			];
		}
	}

	// Return 0 if no thresholds are less than or equal to the amount
	return 0;
};

//TODO: Make this work
export const getRoundBonusPercent = () => {
	const currentDate = new Date();

	// Convert the current date to UTC
	const currentUTCDate = Date.UTC(
		currentDate.getUTCFullYear(),
		currentDate.getUTCMonth(),
		currentDate.getUTCDate(),
		currentDate.getUTCHours(),
		currentDate.getUTCMinutes(),
		currentDate.getUTCSeconds()
	);

	// Sort the dates in descending order to find the most recent past date
	const sortedDates = Object.keys(roundBonusPercents).sort((a, b) => {
		const aDate = a.split("/").map(Number);
		const bDate = b.split("/").map(Number);
		return (
			Date.UTC(bDate[2], bDate[0] - 1, bDate[1]) -
			Date.UTC(aDate[2], aDate[0] - 1, aDate[1])
		);
	});
	for (let date of sortedDates) {
		const [month, day, year] = date.split("/").map(Number);

		// Convert the bonus date to UTC
		const bonusUTCDate = Date.UTC(year, month - 1, day);

		if (currentUTCDate >= bonusUTCDate) {
			return roundBonusPercents[date as keyof typeof roundBonusPercents];
		}
	}

	// Return null if no dates are past the current date
	return null;
};
