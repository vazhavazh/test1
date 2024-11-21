"use client";

import { useRef } from "react";

export const useInterval = (
	callbackRef: { current: (() => void) | null },
	delay: number
) => {
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const startInterval = () => {
		if (intervalRef.current) return; 
		intervalRef.current = setInterval(() => {
			if (callbackRef.current) {
				callbackRef.current();
			}
		}, delay);
	};

	const clear = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current); 
			intervalRef.current = null;
		}
	};

	return { startInterval, clear };
};
