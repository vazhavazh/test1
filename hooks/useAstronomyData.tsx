"use client";

import { fetchSkyObjects } from "@/api/fetch-sky-objects";
import { FormValues } from "@/interfaces/form-values";
import { SkyObject } from "@/interfaces/sky-object";
import { useCallback, useState } from "react";

export const useAstronomyData = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchAstronomyData = useCallback(
		async (values: FormValues): Promise<SkyObject[]> => {
			setLoading(true);
			setError(null); 
			try {
				const skyObjects = await fetchSkyObjects(values);
				return skyObjects; 
			} catch (err) {
				const error = err as Error;
				setError(error.message);
				return []; 
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	return {
		loading,
		error,
		fetchAstronomyData, // Экспортируем для ручного вызова
	};
};
