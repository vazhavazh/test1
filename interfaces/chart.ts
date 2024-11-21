import { SkyObject } from "./sky-object";

export interface ChartProps {
	scrollContainerRef: React.RefObject<HTMLDivElement>;
	animationDuration: number;
	chartWidth: number;
	chartData: SkyObject[];
	isTimeLapseWorking: boolean;
	handleScroll: () => void;
}
