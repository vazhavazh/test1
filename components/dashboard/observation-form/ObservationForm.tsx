import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { Button } from "@/components/ui/button";
import { ObservationFormProps } from "@/interfaces/observer-form";

const validationSchema = Yup.object({
	date: Yup.string().required("Date is required"),
	time: Yup.string().required("Time is required"),
	latitude: Yup.string()
		.matches(/^\d+\.\d{1,2}\.\d{1}$/, "Invalid latitude format")
		.required("Latitude is required"),
	longitude: Yup.string()
		.matches(/^\d+\.\d{1,2}\.\d{1}$/, "Invalid longitude format")
		.required("Longitude is required"),
});
export const ObservationForm = ({
	initialValues,
	startTimelapse,
	stopTimelapse,
	submitHandler,
}: ObservationFormProps) => {
	return (
		<>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={submitHandler}>
				{({}) => (
					<Form>
						<Field
							name='date'
							type='date'
						/>
						<ErrorMessage
							name='date'
							component='div'
						/>
						<Field
							name='time'
							type='time'
						/>
						<ErrorMessage
							name='time'
							component='div'
						/>
						<Field name='latitude' />
						<ErrorMessage
							name='latitude'
							component='div'
						/>
						<Field name='longitude' />
						<ErrorMessage
							name='longitude'
							component='div'
						/>
						<Button type='submit'>FETCH</Button>
						<Button
							type='button'
							onClick={startTimelapse}>
							Start Timelapse
						</Button>
						<Button
							type='button'
							onClick={stopTimelapse}>
							Stop Timelapse
						</Button>
					</Form>
				)}
			</Formik>
		</>
	);
};
