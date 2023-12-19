import numeral from "numeral";

export const formatCurrency = ({ number, language = "en" }) => {
	let resultFormat = "";

	switch (language) {
		case "en-CA":
			resultFormat = numeral(number).format("0,0.00") + " CAD";
			break;
		default:
			resultFormat = "$ " + numeral(number).format("0,0.00");
	}

	return resultFormat;
};

export const formatCurrencyPrefix = (number, decimals = 2, language = "en") => {
	let resultFormat = "";
	let decimal = ".";

	for (let i = 0; i < decimals; i++) {
		decimal += "0";
	}

	switch (language) {
		default:
			resultFormat = "$ " + numeral(number).format(`0,0${decimal}`);
	}

	return resultFormat;
};
