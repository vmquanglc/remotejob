export const ACCOUNT_LISTS = [
	{
		id: 1,
		firstName: "First name",
		lastName: "Last name",
		email: "example1@email.com",
		label: "example1@email.com",
		value: "example1@email.com",
		organization: "Yes4All",
		lineManager: "thuatnt@yes4all.com",
		department: "INNONET",
		status: "active",
		role: "admin",
		createdTime: "dd/mm/yyyy",
		createdBy: "Person 1",
		approvedTime: "dd/mm/yyyy",
		approvedBy: "None",
		partner: ["partner1", "partner2"],
		permission: {
			viewAssumption: true,
			adjustAssumption: true,
			viewProfit: true,
			adjustProfit: true,
		},
		additionalPer: {},
	},
	{
		id: 2,
		firstName: "First name",
		lastName: "Last name",
		email: "example2@email.com",
		label: "example2@email.com",
		value: "example2@email.com",
		organization: "Yes4All",
		lineManager: "thuatnt@yes4all.com",
		department: "SPD",
		status: "deactive",
		role: "saleAdmin",
		createdTime: "dd/mm/yyyy",
		createdBy: "Person 2",
		approvedTime: "dd/mm/yyyy",
		approvedBy: "None",
		partner: ["partner1", "partner2"],
		permission: {
			viewAssumption: true,
			adjustAssumption: false,
			viewProfit: false,
			adjustProfit: false,
		},
		additionalPer: { adjustAssumption: true },
	},
	{
		id: 3,
		firstName: "First name",
		lastName: "Last name",
		email: "example3@email.com",
		label: "example3@email.com",
		value: "example3@email.com",
		organization: "Yes4All",
		department: "IT",
		lineManager: "thuatnt@yes4all.com",
		status: "active",
		role: "user",
		createdTime: "dd/mm/yyyy",
		createdBy: "Register",
		approvedTime: "dd/mm/yyyy",
		approvedBy: "Person Abc",
		partner: ["partner1", "partner2"],
		permission: {
			viewAssumption: false,
			adjustAssumption: false,
			viewProfit: false,
			adjustProfit: false,
		},
		additionalPer: {},
	},
];

export const getAccounts = async (data): Promise<any> => {
	let result = {
		data: ACCOUNT_LISTS,
		totalItems: 3,
	};
	return await new Promise((res) => {
		setTimeout(() => {
			res(result);
		}, 1000);
	});
};

export const getAccountProfile = async (id): Promise<any> => {
	const data = ACCOUNT_LISTS.find((item) => item.id.toString() === id.toString());
	return await new Promise((res) => {
		setTimeout(() => {
			res(data);
		}, 1000);
	});
};

export const getGroupPermissions = async (data): Promise<any> => {
	let result = {
		data: [
			{
				id: 1,
				code: "admin",
				role: "Admin",
				desc: "",
				permission: {
					viewAssumption: true,
					adjustAssumption: true,
					viewProfit: true,
					adjustProfit: true,
				},
				accountsList: [
					...Array(19).fill({
						id: 1,
						firstName: "First name",
						lastName: "Last name",
						email: "example1@email.com",
						label: "example1@email.com",
						value: "example1@email.com",
						organization: "Yes4All",
						department: "INNONET",
						status: "active",
						role: "admin",
						createdTime: "dd/mm/yyyy",
						createdBy: "Person 1",
						approvedTime: "dd/mm/yyyy",
						approvedBy: "None",
					}),
					{
						id: 2,
						firstName: "First name",
						lastName: "Last name",
						email: "example2@email.com",
						label: "example2@email.com",
						value: "example2@email.com",
						organization: "Yes4All",
						department: "SPD",
						status: "deactive",
						role: "saleAdmin",
						createdTime: "dd/mm/yyyy",
						createdBy: "Person 2",
						approvedTime: "dd/mm/yyyy",
						approvedBy: "None",
					},
				],
			},
			{
				id: 2,
				code: "BAAdmin",
				role: "BAAdmin",
				desc: "Create, update assumption in order to apply new scenario to calculate",
				permission: {
					viewAssumption: true,
					adjustAssumption: true,
					viewProfit: false,
					adjustProfit: false,
				},
				accountsList: Array(20).fill({
					id: 2,
					firstName: "First name",
					lastName: "Last name",
					email: "example2@email.com",
					label: "example2@email.com",
					value: "example2@email.com",
					organization: "Yes4All",
					department: "SPD",
					status: "deactive",
					role: "saleAdmin",
					createdTime: "dd/mm/yyyy",
					createdBy: "Person 2",
					approvedTime: "dd/mm/yyyy",
					approvedBy: "None",
				}),
			},
			{
				id: 3,
				code: "user",
				role: "User",
				desc: "Use basic functions",
				permission: {
					viewAssumption: false,
					adjustAssumption: false,
					viewProfit: true,
					adjustProfit: true,
				},
				accountsList: Array(20).fill({
					id: 3,
					firstName: "First name",
					lastName: "Last name",
					email: "example3@email.com",
					label: "example3@email.com",
					value: "example3@email.com",
					organization: "PartnerName",
					department: "",
					status: "active",
					role: "user",
					createdTime: "dd/mm/yyyy",
					createdBy: "Register",
					approvedTime: "dd/mm/yyyy",
					approvedBy: "Person Abc",
				}),
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

export const getPartnerListing = async (data): Promise<any> => {
	let result = {
		data: [
			{
				id: 1,
				code: "Yes4All",
				partnerName: "Yes4All",
				desc: "Description Yess4All",
				assumption: ["1", "2"],
				conditions: {
					cmRamUpPrice: 1000,
					cmRamUpPercent: 200,
				},
				accounts: Array(20).fill({
					id: 1,
					firstName: "First name",
					lastName: "Last name",
					email: "example1@email.com",
					label: "example1@email.com",
					value: "example1@email.com",
					organization: "Yes4All",
					department: "SPD",
					status: "deactive",
					role: "saleAdmin",
					createdTime: "dd/mm/yyyy",
					createdBy: "Person 1",
					approvedTime: "dd/mm/yyyy",
					approvedBy: "None",
				}),
			},
			{
				id: 2,
				code: "Partner1",
				partnerName: "Partner1",
				desc: "Description partner 1",
				assumption: ["1"],
				conditions: {
					Y4ABEPPriceBauPrice: 400,
					BEPPriceRamPrice: 200,
				},
				accounts: Array(20).fill({
					id: 1,
					firstName: "First name",
					lastName: "Last name",
					email: "example1@email.com",
					label: "example1@email.com",
					value: "example1@email.com",
					organization: "Yes4All",
					department: "SPD",
					status: "deactive",
					role: "saleAdmin",
					createdTime: "dd/mm/yyyy",
					createdBy: "Person 1",
					approvedTime: "dd/mm/yyyy",
					approvedBy: "None",
				}),
			},
			{
				id: 3,
				code: "Partner2",
				partnerName: "Partner2",
				desc: "Description partner 2",
				assumption: [],
				conditions: {
					netProfitRamPrice: 288,
					netProfitRamPercent: 200,
				},
				accounts: Array(20).fill({
					id: 1,
					firstName: "First name",
					lastName: "Last name",
					email: "example1@email.com",
					label: "example1@email.com",
					value: "example1@email.com",
					organization: "Yes4All",
					department: "SPD",
					status: "deactive",
					role: "saleAdmin",
					createdTime: "dd/mm/yyyy",
					createdBy: "Person 1",
					approvedTime: "dd/mm/yyyy",
					approvedBy: "None",
				}),
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
export const getConditionsPartner = async (data: string): Promise<any> => {
	let result = {
		data: [
			{
				id: 1,
				code: "Yes4All",
				partnerName: "Yes4All",
				desc: "Description Yess4All",
				assumption: ["1", "2"],
				conditions: {
					cmRamUpPrice: 1000,
					cmRamUpPercent: 200,
					netProfitBauPrice: 20,
				},
				accounts: Array(20).fill({
					id: 1,
					firstName: "First name",
					lastName: "Last name",
					email: "example1@email.com",
					label: "example1@email.com",
					value: "example1@email.com",
					organization: "Yes4All",
					department: "SPD",
					status: "deactive",
					role: "saleAdmin",
					createdTime: "dd/mm/yyyy",
					createdBy: "Person 1",
					approvedTime: "dd/mm/yyyy",
					approvedBy: "None",
				}),
			},
			{
				id: 2,
				code: "Partner1",
				partnerName: "Partner1",
				desc: "Description partner 1",
				assumption: ["1"],
				conditions: {
					Y4ABEPPriceBauPrice: 400,
					Y4ABEPPriceRamPrice: 200,
				},
				accounts: Array(20).fill({
					id: 1,
					firstName: "First name",
					lastName: "Last name",
					email: "example1@email.com",
					label: "example1@email.com",
					value: "example1@email.com",
					organization: "Yes4All",
					department: "SPD",
					status: "deactive",
					role: "saleAdmin",
					createdTime: "dd/mm/yyyy",
					createdBy: "Person 1",
					approvedTime: "dd/mm/yyyy",
					approvedBy: "None",
				}),
			},
			{
				id: 3,
				code: "Partner2",
				partnerName: "Partner2",
				desc: "Description partner 2",
				assumption: [],
				conditions: {
					netProfitRamPrice: 1000,
					netProfitRamPercent: 200,
				},
				accounts: Array(20).fill({
					id: 1,
					firstName: "First name",
					lastName: "Last name",
					email: "example1@email.com",
					label: "example1@email.com",
					value: "example1@email.com",
					organization: "Yes4All",
					department: "SPD",
					status: "deactive",
					role: "saleAdmin",
					createdTime: "dd/mm/yyyy",
					createdBy: "Person 1",
					approvedTime: "dd/mm/yyyy",
					approvedBy: "None",
				}),
			},
		],
		totalItems: 3,
	};
	return await new Promise((res) => {
		setTimeout(() => {
			res(result.data.find((item) => item.code === data));
		}, 1000);
	});
};

export const getActivitiesListing = async (): Promise<any> => {
	let result = [
		{
			id: 1,
			groupSettings: "Manage Assumption",
			child: [
				{
					id: 11,
					activity: "View Assumption, view assumption history",
					role: ["Admin", "Sales admin"],
				},
				{
					id: 12,
					activity: "Create, edit, delete Assumption",
					role: ["Sales admin"],
				},
			],
		},
		{
			id: 2,
			groupSettings: "Manage Profit Simulation",
			child: [
				{
					id: 21,
					activity: "View Profit Simulation",
					role: ["User"],
				},
				{
					id: 22,
					activity: "Create, edit, delete Profit Simulation",
					role: ["User"],
				},
			],
		},
	];
	return await new Promise((res) => {
		setTimeout(() => {
			res(result);
		}, 1000);
	});
};

export const getAccountsList = async (): Promise<any> => {
	return await new Promise((res) => {
		setTimeout(() => {
			res([3, 4, 5, 6, 7, 8, 9, 10].map((item) => `example${item}@gmail.com`));
		}, 1000);
	});
};
