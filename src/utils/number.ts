import numeral from "numeral";

export const formatNumber = ({ number, decimals = 2, language = "en" }) => {
	let resultFormat = "";
	let decimal = ".";

	for (let i = 0; i < decimals; i++) {
		decimal += "0";
	}

	switch (language) {
		default:
			resultFormat = numeral(number).format(`0,0${decimal}`);
	}

	return resultFormat;
};

export const allowOnlyTypeNum = (value) => {
	const regex = /([0-9]*[\.]{0,1}[0-9]{0,2})/s;
	return value.match(regex)[0];
};
