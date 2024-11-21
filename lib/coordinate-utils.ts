/**
 * Validates coordinate input in the D.MM.TM format.
 * @param input - The coordinate string to validate.
 * @returns Parsed components of the coordinate if valid.
 * @throws Error if the format or values are invalid.
 */
export const validateCoordinates = (
	input: string
): [number, number, number] => {
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

	return [degrees, minutes, tenths];
};

/**
 * Converts validated coordinate components into decimal degrees.
 * @param degrees - The degrees component of the coordinate.
 * @param minutes - The minutes component of the coordinate.
 * @param tenths - The tenths component of the coordinate.
 * @returns The decimal degree representation.
 */
export const parseCoordinates = (
	degrees: number,
	minutes: number,
	tenths: number
): number => {
	const decimalMinutes = minutes + tenths / 10;
	return degrees < 0
		? degrees - decimalMinutes / 60
		: degrees + decimalMinutes / 60;
};

//  usage
export const formatCoordinates = (input: string): number => {
	const [degrees, minutes, tenths] = validateCoordinates(input);
	return parseCoordinates(degrees, minutes, tenths);
};
