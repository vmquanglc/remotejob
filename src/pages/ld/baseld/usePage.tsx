import { mergeWith, clone, pick } from "lodash";
import { useState, ChangeEvent,MouseEvent } from "react";
import { PAGINATION } from "src/constants";

export const usePage=()=>{
    const [params, setParams]: any = useState({
		itemsPerPage: PAGINATION.PAGE_SIZE,
		page: PAGINATION.PAGE,
	});

	const mergeParams = mergeWith(
		{
			itemsPerPage: PAGINATION.PAGE_SIZE,
			page: PAGINATION.PAGE,
		},
		clone(params)
	);

    const handleOnPageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setParams({ page: newPage, itemsPerPage: params?.itemsPerPage || PAGINATION.PAGE_SIZE });
	};

	const handleOnRowsPerPageChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setParams({
			itemsPerPage: parseInt(event.target.value, 10),
			page: PAGINATION.PAGE,
		});
	};
    const { itemsPerPage, page } = pick(params, ["itemsPerPage", "page"]);
    return {
        itemsPerPage, 
        page,
        handleOnPageChange,
        handleOnRowsPerPageChange
    }
}