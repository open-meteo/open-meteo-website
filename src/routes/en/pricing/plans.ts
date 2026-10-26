/**
 * The plans of the pricing page, rendered natively instead of through Stripe's
 * hosted pricing table. The subscribe buttons open Stripe Payment Links, which
 * are public by design: the amount, product and tax settings are fixed on
 * Stripe's side, so a link can only ever charge the configured price, and any
 * link can be deactivated and replaced in the dashboard. Prices below are
 * copied from the dashboard and have to follow when they change there.
 */
import {
	STRIPE_LINK_PROFESSIONAL_10M_MONTH,
	STRIPE_LINK_PROFESSIONAL_10M_YEAR,
	STRIPE_LINK_PROFESSIONAL_MONTH,
	STRIPE_LINK_PROFESSIONAL_YEAR,
	STRIPE_LINK_STANDARD_MONTH,
	STRIPE_LINK_STANDARD_YEAR
} from '$app/env/public';

export type Interval = 'month' | 'year';

/** A volume pricing tier: every unit costs `unitAmount` when the quantity is at most `upTo`. */
interface Tier {
	upTo: number | null;
	unitAmount: number;
}

/** One entry of a plan's volume dropdown. */
export interface PlanOption {
	/** The API calls of the option, e.g. "50-60 million calls". */
	label: string;
	/** CHF per interval for the lowest quantity of the option. */
	price: Record<Interval, number>;
	/** Units of 10 million calls the option covers; absent for the flat 5 million price. */
	units?: { from: number; upTo: number | null };
	link: Record<Interval, string>;
}

export interface Plan {
	name: string;
	description: string;
	features: string[];
	/** CHF per interval of a plan with one price. */
	price?: Record<Interval, number>;
	/** Stripe Payment Link per interval of a plan with one price; an empty link disables the button. */
	link?: Record<Interval, string>;
	/** The volumes of a plan sold in several sizes, chosen in a dropdown. */
	options?: PlanOption[];
	/** Plans without self-service checkout link here instead. */
	contact?: string;
}

/** One Payment Link per price, created in the Stripe dashboard and set in the build environment (see `src/env.ts`). */
const links = {
	standard: { month: STRIPE_LINK_STANDARD_MONTH, year: STRIPE_LINK_STANDARD_YEAR },
	professional: { month: STRIPE_LINK_PROFESSIONAL_MONTH, year: STRIPE_LINK_PROFESSIONAL_YEAR },
	professional10m: {
		month: STRIPE_LINK_PROFESSIONAL_10M_MONTH,
		year: STRIPE_LINK_PROFESSIONAL_10M_YEAR
	}
};

/** Price per unit of 10 million calls, falling with the quantity (volume pricing). */
const tiers10m: Record<Interval, Tier[]> = {
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
};

/**
 * The dropdown of the professional plan: the flat 5 million price first, then
 * one option per volume tier, priced for the lowest quantity of the tier as
 * the Stripe pricing table previews it.
 */
const professionalOptions: PlanOption[] = [
	{ label: '5 million calls', price: { month: 99, year: 1099 }, link: links.professional },
	...tiers10m.month.map((tier, i): PlanOption => {
		const from = i === 0 ? 1 : (tiers10m.month[i - 1].upTo ?? 0) + 1;
		const label =
			tier.upTo === null
				? `${from * 10}+ million calls`
				: tier.upTo === from
					? `${from * 10} million calls`
					: `${from * 10}-${tier.upTo * 10} million calls`;
		return {
			label,
			price: { month: from * tier.unitAmount, year: from * tiers10m.year[i].unitAmount },
			units: { from, upTo: tier.upTo },
			link: links.professional10m
		};
	})
];

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
		description:
			'From 5 million API calls monthly, access to historical and climate data. Larger volumes come in steps of 10 million calls.',
		options: professionalOptions,
		features: [
			'5 million API calls monthly or more',
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
