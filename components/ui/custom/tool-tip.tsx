import { TooltipProps } from "recharts";
import {
	ValueType,
	NameType,
} from "recharts/types/component/DefaultTooltipContent";

export const CustomTooltip = ({
	active,
	payload,
}: TooltipProps<ValueType, NameType>) => {
	if (active && payload && payload.length) {
		const { name, azimuth, altitude } = payload[0].payload;
		return (
			<div className='tooltip'>
				<p>Name: {name}</p>
				<p>Azimuth: {azimuth}°</p>
				<p>Altitude: {altitude}°</p>
			</div>
		);
	}
	return null;
};
