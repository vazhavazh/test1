export const interpolate = (
	start: number,
	end: number,
	progress: number
): number => start + (end - start) * progress;

export const animateInterpolation = <
	T extends { azimuth: number; altitude: number }
>(
	initialData: T[],
	targetData: T[],
	duration: number,
	onUpdate: (updatedData: T[]) => void,
	onComplete?: () => void
) => {
	let frameId: number | null = null;
	const startTime = performance.now();

	const animate = () => {
		const now = performance.now();
		const progress = Math.min((now - startTime) / duration, 1); // Нормализуем [0, 1]

		const updatedData = targetData.map((point, index) => {
			const prevPoint = initialData[index] || point;
			return {
				...point,
				azimuth: interpolate(prevPoint.azimuth, point.azimuth, progress),
				altitude: interpolate(prevPoint.altitude, point.altitude, progress),
			};
		});

		onUpdate(updatedData);

		if (progress < 1) {
			frameId = requestAnimationFrame(animate);
		} else if (onComplete) {
			onComplete();
		}
	};

	frameId = requestAnimationFrame(animate);

	return () => {
		if (frameId) cancelAnimationFrame(frameId);
	};
};
