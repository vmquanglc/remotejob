import React, { FC } from "react";
import { PATH } from "src/constants/paths";
import { MuiBreadcrumbs } from "src/components/breadcrumbs";
const { HOME } = PATH;
interface Props {
	id: string;
}

export const PartnerBreadcrumbs: FC<Props> = ({ id }) => {
	const items = [{ path: HOME, name: "Home" }, { name: id }];

	return <MuiBreadcrumbs items={items} />;
};
