import get from "lodash/get";
import { IValidateFormik } from "src/interface/formik";

const touched = ({ formik, field }: { formik: any; field: string }) =>
	get(formik, `touched[${field}]`);

const error = ({ formik, field }: { formik: any; field: string }) =>
	get(formik, `errors[${field}]`);

const value = ({ formik, field }: { formik: any; field: string }) =>
	get(formik, `values[${field}]`);

export const getValidateFormik = ({
	formik,
	field,
	required = false,
	showHelpText = true,
	handleChange = (e) => {},
}): IValidateFormik => {
	let result: any = {
		onBlur: formik.handleBlur,
		onChange: (e: any) => {
			formik.handleChange(e);
			handleChange(e);
		},
		value: value({ formik, field }),
	};

	if (required) {
		result.error = touched({ formik, field }) && Boolean(error({ formik, field }));
		result.helperText =
			showHelpText &&
			touched({ formik, field }) &&
			error({ formik, field }) &&
			get(formik, `errors[${field}]`);
	}

	return result;
};

export const getValidateNumeric = ({
	formik,
	field,
	required = false,
	showHelpText = true,
}): any => {
	let result: any = {
		onBlur: formik.handleBlur,
		onValueChange: (values: any) => {
			formik.setFieldValue(field, values?.floatValue || NaN);
		},
		value: value({ formik, field }),
	};

	if (required) {
		result.error = touched({ formik, field }) && Boolean(error({ formik, field }));
		result.helperText =
			showHelpText &&
			touched({ formik, field }) &&
			error({ formik, field }) &&
			get(formik, `errors[${field}]`);
	}

	return result;
};
