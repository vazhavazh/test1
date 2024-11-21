import { FormValues } from "./form-values";

export interface ObservationFormProps {
	initialValues: FormValues;

	startTimelapse: () => void;

	stopTimelapse: () => void;

	submitHandler: (values: FormValues) => Promise<void>;
}
