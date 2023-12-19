export interface IValidateFormik {
	formik: any;
	field: string;
	required?: boolean;
	showHelpText?: boolean;
	handleChange?: (e?: any) => void;
	translate: any;
}
