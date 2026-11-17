import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * A Stripe Payment Link is public by design, but keeping the URLs out of the
 * repository lets them be rotated in the deployment settings without a
 * commit. Each is inlined into the static build; a build without them, such
 * as a pull request check, renders the subscribe buttons disabled.
 */
const paymentLink = {
	public: true,
	static: true,
	schema: (value: string | undefined) => value ?? ''
} as const;

export const variables = defineEnvVars({
	STRIPE_LINK_STANDARD_MONTH: { ...paymentLink, description: 'API Standard, monthly' },
	STRIPE_LINK_STANDARD_YEAR: { ...paymentLink, description: 'API Standard, yearly' },
	STRIPE_LINK_PROFESSIONAL_MONTH: { ...paymentLink, description: 'API Professional, monthly' },
	STRIPE_LINK_PROFESSIONAL_YEAR: { ...paymentLink, description: 'API Professional, yearly' },
	STRIPE_LINK_PROFESSIONAL_10M_MONTH: {
		...paymentLink,
		description: 'API Professional per 10 million calls, monthly, adjustable quantity'
	},
	STRIPE_LINK_PROFESSIONAL_10M_YEAR: {
		...paymentLink,
		description: 'API Professional per 10 million calls, yearly, adjustable quantity'
	}
});
