import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	7
); // 7-character random string

export function numberWithCommas(x: number) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function sumArrayProperty(
	propertyName: string,
	array?: any[] | null,
	filterKey = null as string | null,
	filterValue = null as string | number | null
) {
	let sum = 0;
	if (!array) return sum;

	array.forEach((item) => {
		// If a filterKey is provided, check if the item property equals the filterValue
		if (filterKey !== null) {
			if (item[filterKey] === filterValue) {
				// Add the value to the sum if it is a number
				sum += typeof item[propertyName] === "number" ? item[propertyName] : 0;
			}
		} else {
			// If no filterKey is provided, add the value to the sum if it is a number
			sum += typeof item[propertyName] === "number" ? item[propertyName] : 0;
		}
	});

	return sum;
}
