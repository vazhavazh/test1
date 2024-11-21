import { FormValues } from "@/interfaces/form-values";
import { SkyObject } from "@/interfaces/sky-object";
import { formatCoordinates } from "@/lib/coordinate-utils";



export const fetchSkyObjects = async (
	values: FormValues
): Promise<SkyObject[]> => {
	const [year, month, day] = values.date.split("-");
	const [hour, minute, second] = values.time.split(":");

	const parsedLatitude = formatCoordinates(values.latitude);
	const parsedLongitude = formatCoordinates(values.longitude);

	const url = `https://seawalker.network:3000/api/sky-objects?year=${year}&month=${month}&day=${day}&hour=${hour}&minute=${minute}&second=${second}&latitude=${parsedLatitude}&longitude=${parsedLongitude}`;

	const response = await fetch(url);
	const data = await response.json();

	if (data.error) {
		throw new Error(data.error);
	}

	return data;
};
