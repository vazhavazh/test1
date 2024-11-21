"use client";

import {
	ScatterChart,
	XAxis,
	YAxis,
	Scatter,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
} from "recharts";

import { CustomTooltip } from "@/components/ui/custom/tool-tip";
import { ChartProps } from "@/interfaces/chart";
import { useEffect, useState } from "react";

const interpolate = (start: number, end: number, progress: number): number =>
	start + (end - start) * progress;

export const Chart = ({
	scrollContainerRef,
	animationDuration,
	chartWidth,
	chartData,
	isTimeLapseWorking,
	handleScroll,
}: ChartProps & { isTimeLapseWorking: boolean }) => {
	const [interpolatedData, setInterpolatedData] = useState(chartData);

	useEffect(() => {
		if (!isTimeLapseWorking) {
			setInterpolatedData(chartData);
			return;
		}
		let frameId: number | null = null;
		const startTime = performance.now();

		const animate = () => {
			const now = performance.now();
			const progress = Math.min((now - startTime) / animationDuration, 1); // Нормализуем [0, 1]

			const updatedData = chartData.map((point, index) => {
				const prevPoint = interpolatedData[index] || point;
				return {
					...point,
					azimuth: interpolate(prevPoint.azimuth, point.azimuth, progress),
					altitude: interpolate(prevPoint.altitude, point.altitude, progress),
				};
			});

			setInterpolatedData(updatedData);

			if (progress < 1) {
				frameId = requestAnimationFrame(animate);
			}
		};

		frameId = requestAnimationFrame(animate);

		return () => {
			if (frameId) cancelAnimationFrame(frameId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chartData, isTimeLapseWorking]);

	return (
		<div
			ref={scrollContainerRef}
			onScroll={handleScroll}
			className=''
			style={{ overflowX: "scroll", whiteSpace: "nowrap" }}>
			<div style={{ display: "inline-block", width: chartWidth }}>
				<ResponsiveContainer
					width='100%'
					height={600}>
					<ScatterChart>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis
							type='number'
							dataKey='azimuth'
							name='Azimuth'
							unit='°'
							domain={[0, 360]}
							ticks={[
								0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195,
								210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360,
							]}
						/>
						<YAxis
							type='number'
							dataKey='altitude'
							name='Altitude'
							unit='°'
							domain={[0, 90]}
							ticks={[0, 15, 30, 45, 60, 75, 90]}
							interval={0}
							allowDataOverflow={true}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Scatter
							isAnimationActive={false} // Управляем анимацией вручную
							data={interpolatedData}
							fill='#8884d8'
							shape='circle'
						/>
					</ScatterChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
