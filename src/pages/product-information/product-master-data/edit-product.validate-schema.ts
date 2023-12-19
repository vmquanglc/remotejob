import * as Yup from "yup";

export const SCHEMA_EDIT_PRODUCT = Yup.object({
	sku: Yup.object({
		sell_type: Yup.string().required("Field is required"),
		life_cycle: Yup.string().required("Field is required"),
		order_proccessing_lead_time: Yup.string().required("Field is required"),
		international_transportation_lead_time: Yup.string().required("Field is required"),
		domestic_lead_time: Yup.string().required("Field is required"),
		category: Yup.object({
			relative_root_category: Yup.object({
				id: Yup.string().required("Field is required"),
			}),
			relative_main_category: Yup.object({
				id: Yup.string().required("Field is required"),
			}),
			relative_category: Yup.object({
				id: Yup.string().required("Field is required"),
			}),
			relative_subcategory: Yup.object({
				id: Yup.string().required("Field is required"),
			}),
			relative_last_category: Yup.object({
				id: Yup.string().required("Field is required"),
			}),
		}),
	}),
});

export const SCHEMA_EDIT_PRODUCT_ADMIN = Yup.object({
	sku: Yup.object({
		sales_id: Yup.string().required("Field is required"),
		manager_id: Yup.string().required("Field is required"),
		sell_type: Yup.string().required("Field is required"),
		life_cycle: Yup.string().required("Field is required"),
		order_proccessing_lead_time: Yup.string().required("Field is required"),
		international_transportation_lead_time: Yup.string().required("Field is required"),
		domestic_lead_time: Yup.string().required("Field is required"),
		category: Yup.object({
			relative_root_category: Yup.object({
				id: Yup.string().required("Field is required"),
			}),
			relative_main_category: Yup.object({
				id: Yup.string().required("Field is required"),
			}),
			relative_category: Yup.object({
				id: Yup.string().required("Field is required"),
			}),
			relative_subcategory: Yup.object({
				id: Yup.string().required("Field is required"),
			}),
			relative_last_category: Yup.object({
				id: Yup.string().required("Field is required"),
			}),
		}),
	}),
});
