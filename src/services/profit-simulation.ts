export const getVariation = async (data): Promise<any> => {
	let result = {
		data: [
			{
				id: 1,
				productName: "Item 1",
				asin: "B07ZSBC7L7",
				cmRamUpPrice: 1500,
				cmRamUpPercent: 300,
				cmBauUpPrice: 22,
				cmBauUpPercent: 22,
				netProfitRamPrice: 22,
				netProfitRamPercent: 22,
				netProfitBauPrice: 22,
				netProfitBauPercent: 22,
				Y4ABEPPriceRamPrice: 22,
				Y4ABEPPriceBauPrice: 700,
				BEPPriceRamPrice: 22,
				createdBy: "User",
				createdTime: "dd/mm/yyyy - hh:mm:ss",
				updatedTime: "dd/mm/yyyy - hh:mm:ss",
				appliedAssumption: "View default v2.0",
			},
			{
				id: 2,
				productName: "Item 2",
				asin: "B07ZSBC7L7",
				cmRamUpPrice: 900,
				cmRamUpPercent: 30,
				cmBauUpPrice: 22,
				cmBauUpPercent: 22,
				netProfitRamPrice: 22,
				netProfitRamPercent: 222,
				netProfitBauPrice: 22,
				netProfitBauPercent: 22,
				Y4ABEPPriceRamPrice: 22,
				Y4ABEPPriceBauPrice: 22,
				BEPPriceRamPrice: 222,
				createdBy: "User",
				createdTime: "dd/mm/yyyy - hh:mm:ss",
				updatedTime: "dd/mm/yyyy - hh:mm:ss",
				appliedAssumption: "View default v2.0",
			},
			{
				id: 3,
				productName: "Item 3",
				asin: "B07ZSBC7L7",
				cmRamUpPrice: 1500,
				cmRamUpPercent: 30,
				cmBauUpPrice: 22,
				cmBauUpPercent: 22,
				netProfitRamPrice: 300,
				netProfitRamPercent: 22,
				netProfitBauPrice: 22,
				netProfitBauPercent: 22,
				Y4ABEPPriceRamPrice: 22,
				Y4ABEPPriceBauPrice: 22,
				BEPPriceRamPrice: 22,
				createdBy: "User",
				createdTime: "dd/mm/yyyy - hh:mm:ss",
				updatedTime: "dd/mm/yyyy - hh:mm:ss",
				appliedAssumption: "View default v2.0",
			},
		],
		totalItems: 3,
	};
	return await new Promise((res) => {
		setTimeout(() => {
			res(result);
		}, 2000);
	});
};

export const getAssumptionsHistory = async (data): Promise<any> => {
	let result = {
		data: [
			{
				version: "Item 1",
				type: "New version",
				createdBy: "user",
				startDate: "dd/mm/yyyy",
				endDate: "dd/mm/yyyy",
				createdTime: "dd/mm/yyyy - hh:mm:ss",
			},
			{
				version: "Item 2",
				type: "Fix error",
				createdBy: "user",
				startDate: "dd/mm/yyyy",
				endDate: "dd/mm/yyyy",
				createdTime: "dd/mm/yyyy - hh:mm:ss",
			},
			{
				version: "Item 1",
				type: "New version",
				createdBy: "user",
				startDate: "dd/mm/yyyy",
				endDate: "dd/mm/yyyy",
				createdTime: "dd/mm/yyyy - hh:mm:ss",
			},
		],
		totalItems: 3,
	};
	return await new Promise((res) => {
		setTimeout(() => {
			res(result);
		}, 1000);
	});
};

export const getItemsReport = async (data): Promise<any> => {
	let result = {
		details: [
			{
				asin: "B07ZSBC7L7",
				sku: "Cell",
				upc: "UPC",
				ideaCode: "Idea code",
				productName: "product name",
				category: "Category",
				subCategory: "Sub category",
				launchingDate: "dd/mm/yyyy",
				rrp: 40,
				cogs: "Cell",
				submitDI: "Cell",
				submitDS: "Cell",
				submitWH: "Cell",
				freeBAU: "Cell",
				cmBauDI: "Cell",
				cmBauDS: "Cell",
				cmBauWH: "Cell",
				cmBauFBA: "Cell",
				netBauDI: "Cell",
				netBauDS: "Cell",
				netBauWH: "Cell",
				netBauFBA: "Cell",
			},
			{
				asin: "B07ZSBC7L7",
				sku: "Cell",
				upc: "UPC",
				ideaCode: "Idea code",
				productName: "product name",
				category: "Category",
				subCategory: "Sub category",
				launchingDate: "dd/mm/yyyy",
				rrp: 40,
				cogs: "Cell",
				submitDI: "Cell",
				submitDS: "Cell",
				submitWH: "Cell",
				freeBAU: "Cell",
				cmBauDI: "Cell",
				cmBauDS: "Cell",
				cmBauWH: "Cell",
				cmBauFBA: "Cell",
				netBauDI: "Cell",
				netBauDS: "Cell",
				netBauWH: "Cell",
				netBauFBA: "Cell",
			},
			{
				asin: "B07ZSBC7L7",
				sku: "Cell",
				upc: "UPC",
				ideaCode: "Idea code",
				productName: "product name",
				category: "Category",
				subCategory: "Sub category",
				launchingDate: "dd/mm/yyyy",
				rrp: 40,
				cogs: "Cell",
				submitDI: "Cell",
				submitDS: "Cell",
				submitWH: "Cell",
				freeBAU: "Cell",
				cmBauDI: "Cell",
				cmBauDS: "Cell",
				cmBauWH: "Cell",
				cmBauFBA: "Cell",
				netBauDI: "Cell",
				netBauDS: "Cell",
				netBauWH: "Cell",
				netBauFBA: "Cell",
			},
		],
		totalItems: 3,
	};
	return await new Promise((res) => {
		setTimeout(() => {
			res(result);
		}, 1000);
	});
};
