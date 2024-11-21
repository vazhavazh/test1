"use client";
import React, { useState, useRef, useEffect } from "react";

import { FormValues } from "@/interfaces/form-values";
import { SkyObject } from "@/interfaces/sky-object";
import { useAstronomyData } from "@/hooks/useAstronomyData";
import { useInterval } from "@/hooks/useInterval";
import { ObservationForm } from "./observation-form/ObservationForm";
import { Chart } from "./chart/Chart";

const INITIAL_FORM_VALUES: FormValues = {
	date: "2024-10-09",
	time: "12:00:00",
	latitude: "29.28.4",
	longitude: "004.30.5",
};

const CHART_WIDTH = 2400;
const INTERVAL_BETWEEN_REQUESTS = 3000;

const incrementTimeByHour = (values: FormValues): FormValues => {
	const { date, time, latitude, longitude } = values;
	const [year, month, day] = date.split("-").map(Number);
	const [hour, minute, second] = time.split(":").map(Number);
	const currentDate = new Date(year, month - 1, day, hour, minute, second);
	currentDate.setHours(currentDate.getHours() + 1);
	const newDate = currentDate.toISOString().split("T")[0]; // Получаем дату в формате "YYYY-MM-DD"
	const newTime = currentDate.toTimeString().split(" ")[0]; // Получаем время в формате "HH:mm:ss"
	return {
		date: newDate,
		time: newTime,
		latitude,
		longitude,
	};
};

const Dashboard = () => {
	const [isClient, setIsClient] = useState(false);
	const [chartData, setChartData] = useState<SkyObject[]>([]);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isLoading, setIsLoading] = useState(false);
	const [currentFormValues, setCurrentFormValues] = useState<FormValues>();
	const [counter, setCounter] = useState(0);
	const { fetchAstronomyData } = useAstronomyData();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const callbackRef = useRef<(() => void) | null>(null);
	const { startInterval, clear } = useInterval(
		callbackRef,
		INTERVAL_BETWEEN_REQUESTS
	);
	const [isTimeLapseWorking, setIsTimeLapseWorking] = useState(false);

	const startTimelapse = () => {
		setIsTimeLapseWorking(true);
		startInterval();
	};

	const stopTimelapse = () => {
		setIsLoading(false);
		setIsTimeLapseWorking(false);
		clear();
	};

	const timelapseHandler = async () => {
		if (counter >= 24) {
			setCounter(0);
			clear();
			setIsLoading(false);
			return;
		}

		const updatedValues = currentFormValues
			? incrementTimeByHour(currentFormValues)
			: incrementTimeByHour(INITIAL_FORM_VALUES);
		setCurrentFormValues(updatedValues);
		setIsLoading(true);
		try {
			const data = await fetchAstronomyData(updatedValues);
			if (data) {
				setCounter((prev) => prev + 1);
			}
			setChartData(data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.error(error);
		}
	};

	callbackRef.current = timelapseHandler;

	const submitHandler = async (values: FormValues) => {
		setIsLoading(true);
		try {
			const data = await fetchAstronomyData(values);
			setChartData(data);
			setIsLoading(false);
		} catch (err) {
			console.error("Error loading data", err);
			setIsLoading(false);
		}
	};

	const handleScroll = () => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const maxScrollLeft = container.scrollWidth - container.clientWidth;

		// Проверяем достижение конца и перемещаем в начало
		if (container.scrollLeft >= maxScrollLeft - 1) {
			container.scrollLeft = 1; // Устанавливаем чуть дальше начала для плавности
			return;
		}

		// Проверяем достижение начала и перемещаем в конец
		if (container.scrollLeft <= 0) {
			container.scrollLeft = maxScrollLeft - 1; // Устанавливаем чуть ближе к концу для плавности
			return;
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setIsClient(true);
			try {
				const data = await fetchAstronomyData(INITIAL_FORM_VALUES);
				setChartData(data);
				setIsLoading(false);
			} catch (err) {
				setIsLoading(false);
				console.error("Error loading data", err);
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (!isClient) return null;
	return (
		<>
			<ObservationForm
				initialValues={INITIAL_FORM_VALUES}
				startTimelapse={startTimelapse}
				stopTimelapse={stopTimelapse}
				submitHandler={submitHandler}
			/>
			<Chart
				handleScroll={handleScroll}
				isTimeLapseWorking={isTimeLapseWorking}
				animationDuration={INTERVAL_BETWEEN_REQUESTS}
				scrollContainerRef={scrollContainerRef}
				chartWidth={CHART_WIDTH}
				chartData={chartData}
			/>
		</>
	);
};

export default Dashboard;
