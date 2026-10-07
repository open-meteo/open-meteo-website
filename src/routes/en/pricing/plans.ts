/**
 * The plans of the pricing page, rendered natively instead of through Stripe's
 * hosted pricing table. The subscribe buttons open Stripe Payment Links, which
 * are public by design: the amount, product and tax settings are fixed on
 * Stripe's side, so a link can only ever charge the configured price, and any
 * link can be deactivated and replaced in the dashboard. Prices below are
 * copied from the dashboard and have to follow when they change there.
 */
export type Interval = 'month' | 'year';

/** A volume pricing tier: every unit costs `unitAmount` when the quantity is at most `upTo`. */
export interface Tier {
	upTo: number | null;
	unitAmount: number;
}

export interface Plan {
	name: string;
	description: string;
	features: string[];
	/** CHF per interval for one unit; tiered plans price the unit by quantity. */
	price?: Record<Interval, number | Tier[]>;
	/** Stripe Payment Link per interval; an empty link disables the button. */
	link?: Record<Interval, string>;
	/** Plans sold per 10 million calls: the highest quantity the link allows. */
	maxQuantity?: number;
	/** Plans without self-service checkout link here instead. */
	contact?: string;
}

/** One Payment Link per price, created in the Stripe dashboard. */
const links = {
	standard: { month: '', year: '' },
	professional: { month: '', year: '' },
	professional10m: { month: '', year: '' }
};

export const plans: Plan[] = [
	{
		name: 'API Standard',
		description: 'Commercial use license and 1 million monthly API calls for the Open-Meteo API',
		price: { month: 29, year: 319 },
		link: links.standard,
		features: [
			'1 million API calls monthly',
			'Commercial use license',
			'Forecast API',
			'Air Quality, Marine, Flood, Elevation, Geocoding API'
		]
	},
	{
		name: 'API Professional',
		description: 'Up to 5 million API calls monthly, access to historical and climate data',
		price: { month: 99, year: 1099 },
		link: links.professional,
		features: [
			'5 million API calls monthly',
			'Commercial use license',
			'Forecast API',
			'Air Quality, Marine, Flood, Elevation, Geocoding API',
			'Historical Weather API',
			'Climate API',
			'Ensemble API',
			'Historical Forecast API',
			'Previous Model Runs API',
			'Seasonal Forecast API',
			'Single Runs API'
		]
	},
	{
		name: 'API Professional (10 million calls)',
		description:
			'For large amounts of API calls. Price per 10 million calls. E.g. quantity 3 = 30 million calls.',
		price: {
			month: [
				{ upTo: 1, unitAmount: 160 },
				{ upTo: 2, unitAmount: 130 },
				{ upTo: 3, unitAmount: 115 },
				{ upTo: 4, unitAmount: 105 },
				{ upTo: 6, unitAmount: 100 },
				{ upTo: 9, unitAmount: 95 },
				{ upTo: 19, unitAmount: 90 },
				{ upTo: null, unitAmount: 85 }
			],
			year: [
				{ upTo: 1, unitAmount: 1760 },
				{ upTo: 2, unitAmount: 1430 },
				{ upTo: 3, unitAmount: 1265 },
				{ upTo: 4, unitAmount: 1155 },
				{ upTo: 6, unitAmount: 1100 },
				{ upTo: 9, unitAmount: 1045 },
				{ upTo: 19, unitAmount: 990 },
				{ upTo: null, unitAmount: 935 }
			]
		},
		link: links.professional10m,
		maxQuantity: 99,
		features: []
	},
	{
		name: 'API Enterprise (50 million API calls)',
		description:
			'Customised API services for enterprise requirements. 50 million API calls/month, 3 keys, 3 support hours/month',
		contact: 'mailto:info@open-meteo.com',
		features: [
			'Priority Support',
			'SLA',
			'Procurement Process',
			'Volume Discount',
			'Custom Solutions'
		]
	}
];

/** The total in CHF for `quantity` units of a plan per interval, with volume pricing for tiered plans. */
export const planTotal = (price: number | Tier[], quantity: number): number => {
	if (typeof price === 'number') return price * quantity;
	const tier = price.find((t) => t.upTo === null || quantity <= t.upTo) ?? price[price.length - 1];
	return tier.unitAmount * quantity;
};
