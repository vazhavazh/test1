import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseCoordinates = (input: string): number => {
	const pattern = /^(\d+)\.(\d{1,2})\.(\d{1})$/;
	const match = input.match(pattern);

	if (!match) {
		throw new Error(
			"Invalid format. Please use D.MM.TM format (e.g., 29.28.4)"
		);
	}

	const degrees = parseInt(match[1], 10);
	const minutes = parseInt(match[2], 10);
	const tenths = parseInt(match[3], 10);

	if (minutes < 0 || minutes >= 60) {
		throw new Error("Minutes must be between 0 and 59.");
	}

	const decimalMinutes = minutes + tenths / 10;
	return degrees < 0
		? degrees - decimalMinutes / 60
		: degrees + decimalMinutes / 60;
};

export const validateCoordinates = () => {
  
}