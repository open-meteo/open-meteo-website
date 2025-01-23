<script lang="ts">
	import { i18n } from '$lib/i18n';
</script>

<svelte:head>
	<title>🧑‍⚖️ Terms | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/terms" />
	<meta
		name="description"
		content="Terms of Use of Open-Meteo the open-source weather API that offers free access for non-commercial use. No API key required. Our user-friendly API integrates high-resolution local and global weather models, providing accurate forecasts for any location worldwide. We believe in making weather information accessible to everyone and encourage contributions from our users. Contact us via email, social media, or GitHub for any inquiries or feedback. Join us in our mission to provide the most accurate and reliable weather data available."
	/>
</svelte:head>

<div
	class="px-4 py-5 text-center text-white"
	style="
            background-image: url('/images/features_background.webp');
            background-size: cover;
            background-position: center;
            height: 300px;
          "
>
	<svg
		style="filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7));"
		xmlns="http://www.w3.org/2000/svg"
		width="96"
		height="96"
		fill="currentColor"
		class="bi bi-cloud-rain mb-4"
		viewBox="0 0 16 16"
	>
		<path
			d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 0 1-.948-.316l1-3a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 1 1-.948-.316l1-3a.5.5 0 0 1 .632-.317zm.247-6.998a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973zM8.5 2a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 2z"
		/>
	</svg>
	<h1 class="display-5" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">Terms & Privacy</h1>
</div>

<div class="container px-4 py-5">
	<h2 id="terms" class="display-5 lh-1 mb-3">Terms of Use</h2>
	<p>
		Open-Meteo assumes no responsibility for any inaccuracies or omissions in the data, their
		availability, or any losses or damages resulting from their usage. The accuracy and completeness
		of the data products and their uninterrupted provision are not guaranteed by Open-Meteo, and
		they are provided without any warranty, either statutory or otherwise. In any event, Open-Meteo
		disclaims all liability under these Terms of Use, whether arising from contract, tort, or any
		other cause.
	</p>
	<div class="row">
		<div class="col-lg-6">
			<h3>Non-Commercial Use</h3>
			<p>By using the Free API for non-commercial use you agree to following terms:</p>
			<ul>
				<li>Less than 10'000 API calls per day, 5'000 per hour and 600 per minute.</li>
				<li>You may only use the free API services for non-commercial purposes.</li>
				<li>
					You accept to the CC-BY 4.0 license, as specified in the <a
						href={i18n.route('/license')}
						title="Open-Meteo further license details">license conditions</a
					>.
				</li>
				<li>
					We reserve the right to block applications and IP addresses that misuse our service
					without prior notice.
				</li>
			</ul>
			<p>
				Non-commercial use is defined as as
				<a href="https://wiki.creativecommons.org/wiki/NonCommercial_interpretation"
					>elaborated by creative commons</a
				>. To make it easier to understand, here are some examples that qualify as non-commercial
				use:
			</p>
			<ul>
				<li>
					Using our service for private or non-profit websites or apps that do not have
					subscriptions or advertising.
				</li>
				<li>Utilizing our service for personal home automation purposes.</li>
				<li>Using our service for public research conducted at public institutions.</li>
				<li>Incorporating our service into educational content.</li>
			</ul>
			<p>On the other hand, the following examples are considered commercial use:</p>
			<ul>
				<li>Operating websites or apps that have subscriptions or display advertisements.</li>
				<li>Integrating our service into commercial products or promotional activities.</li>
				<li>Conducting undisclosed research at commercial entities.</li>
			</ul>
			<p>
				If you plan to use our service for commercial purposes or require additional API calls, we
				kindly request you to consider subscribing to our API plans as explained in detail on the <a
					href={'/en/pricing'}
					title="Pricing information to use the weather API commercially">pricing</a
				> page. Your subscription helps support the continuous development, maintenance, and support
				of Open-Meteo.
			</p>
		</div>
		<div class="col-lg-6">
			<h3>API Subscription</h3>
			<p>
				When using the <a
					href={'/en/pricing'}
					title="Pricing information to use the weather API commercially">paid API subscription</a
				>, you agree to the following terms:
			</p>
			<ul>
				<li>
					By subscribing to our service, you authorize us to charge the applicable subscription fees
					through the payment gateway Stripe.
				</li>
				<li>
					You agree to provide accurate and up-to-date payment information and promptly update it if
					there are any changes.
				</li>
			</ul>
			<p>Account and Security:</p>
			<ul>
				<li>
					You are responsible for maintaining the confidentiality and security of your account login
					credentials.
				</li>
				<li>You agree not to share your account or login information with any third party.</li>
				<li>You are solely responsible for any activities that occur under your account.</li>
			</ul>
			<p>Intellectual Property:</p>
			<ul>
				<li>
					All intellectual property rights in our SaaS service, including but not limited to
					software, content, and trademarks, belong to us.
				</li>
				<li>
					You are granted a limited, non-exclusive, and non-transferable license to use our service
					for the duration of your subscription.
				</li>
				<li>
					The data obtained through the API is provided under the terms of the CC-BY 4.0 license, as
					specified in the <a
						href={i18n.route('/license')}
						title="Open-Meteo further license details">license conditions</a
					>.
				</li>
			</ul>
			<p>Limitation of Liability:</p>
			<ul>
				<li>
					Our service is provided on an "as is" and "as available" basis without any warranties,
					express or implied.
				</li>
				<li>
					We do not guarantee the accuracy, completeness, or reliability of our service or its
					suitability for your specific needs.
				</li>
				<li>
					We shall not be liable for any indirect, incidental, consequential, or punitive damages
					arising from or related to your use of our service.
				</li>
				<li>
					Our total liability, if any, shall be limited to the amount you paid for the subscription
					fee during the twelve months preceding the claim.
				</li>
			</ul>
			<p>Termination:</p>
			<ul>
				<li>
					Either party may terminate the subscription at the end of each payment schedule, for any
					reason, with or without notice.
				</li>
				<li>
					Upon missed payments, we reserve the right to terminate the subscription and access to our
					service after 14 days.
				</li>
				<li>
					Upon termination, your access to the service and any associated data may be immediately
					deactivated.
				</li>
			</ul>
		</div>
	</div>

	<p>
		We reserve the right to modify these terms of use at any time. Any changes will be effective
		immediately upon posting the revised terms on our website. All changes are transparently tracked
		on <a
			href="https://github.com/open-meteo/open-meteo-website/commits/main/src/routes/en/terms/%2Bpage.svelte"
			title="Modification history of terms of service">GitHub</a
		>.
	</p>
	<p>
		Governing Law: These terms of use shall be governed by and construed in accordance with the laws
		of Switzerland. Any disputes arising from or in connection with these terms shall be subject to
		the exclusive jurisdiction of the courts in Switzerland. Please read these terms of use
		carefully before using our paid API subscription. If you have any questions or concerns, please
		contact us at <a href="mailto:info@open-meteo.com">info@open-meteo.com</a>.
	</p>

	<h2 id="privacy" class="display-5 mt-5">Privacy</h2>
	<p>
		By using our service, you consent to the terms of our privacy policy and agree that we may
		collect non-personal information as outlined below. If you have any questions or concerns about
		our privacy policy, please contact us.
	</p>
	<div class="row">
		<div class="col-lg-6">
			<h3>Website of Open-Meteo.com</h3>
			<p>
				The Open-Meteo.com website does not collect any data from our users, including personal
				information, usage statistics, or any other data that could be used to identify you. We do
				not use any cookies or tracking technologies, and we do not share any data with third-party
				providers.
			</p>
			<p>
				We do not engage in any advertising or marketing practices that would require us to collect
				or use any personal information. You can use our website without any concern that your
				information will be shared with advertisers or marketing agencies.
			</p>
		</div>
		<div class="col-lg-6">
			<h3>Blog and Newsletter</h3>
			<p>
				When you sign up for our newsletter, we collect your email address. We use a secure
				third-party email marketing platform <a
					href="https://substack.com/privacy"
					title="Substack privacy policy">Substack.com</a
				> to manage our newsletter. This platform collects information such as your email address and
				IP address. We use this information solely for the purpose of sending you our newsletter and
				will not share or sell it with any third-party providers.
			</p>
		</div>
		<div class="col-lg-6">
			<h3>Free Non-Commercial API Service</h3>
			<p>
				We may collect non-personal information, such as IP addresses, for technical reasons such as
				server maintenance or prevent misuse, but this information is not linked to user identities
				in any way.
			</p>
			<p>
				For troubleshooting purposes, we keep webserver log files that may contain sensitive
				information such as geographical coordinates. We do not share this data with any third
				party. All log files will be deleted after a period of 90 days.
			</p>
		</div>
		<div class="col-lg-6">
			<h3>Subscription to Paid API Services</h3>
			<p>
				When you sign up for our paid API service and make payments through Stripe, we may collect
				the following information:
			</p>
			<ul>
				<li>Contact information, such as your name, email address, and phone number</li>
				<li>
					Billing information, including your credit card details, billing address, and payment
					history
				</li>
				<li>
					Usage data and analytics, which may include information about how you interact with our
					service
				</li>
				<li>
					We may share your personal with Stripe, who assist us in processing payments and
					delivering our service. Stripe is obligated to protect your information and are prohibited
					from using it for any other purpose.
				</li>
				<li>
					You information is solely used process and manage your payments through Stripe, provide
					our API service, including customer support and troubleshooting
				</li>
			</ul>
			<p>
				When using the API service, we gather certain information, including IP addresses and URLs,
				to monitor the usage of the API. This usage data is associated with your subscription.
				However, after a period of 90 days, all individual log files will be removed, and only
				aggregated usage data will be retained, such as the number of API calls per day.
			</p>
		</div>
	</div>
	<p>
		We take appropriate measures to protect your personal information from unauthorized access,
		alteration, disclosure, or destruction. We maintain industry-standard security practices and
		regularly review and update our security measures to ensure the confidentiality and integrity of
		your information.
	</p>
	<p>
		We will retain your personal information for as long as necessary to fulfill the purposes
		outlined in this privacy notice, unless a longer retention period is required or permitted by
		law.
	</p>
	<p>
		You have the right to access, update, or delete your personal information. If you wish to
		exercise any of these rights or have any questions or concerns about our privacy practices,
		please contact us using the information provided below.
	</p>
	<p>
		We may update this privacy notice from time to time. The updated version will be posted on our
		website, and a detailed change history is available on <a
			href="https://github.com/open-meteo/open-meteo-website/commits/main/src/routes/en/terms/%2Bpage.svelte"
			title="Modification history of terms of service">GitHub</a
		>.
	</p>

	<h2 id="privacy" class="display-5 mt-5">Open-Meteo is operated by</h2>
	<p>
		OpenMeteo GmbH<br />
		Hintere Schilligmatte 6<br />
		6463 Bürglen (UR)<br />
		Switzerland
	</p>
	<p>CEO: Patrick Zippenfenig</p>
	<p>VAT CHE 332.429.722 MWST</p>
	<p>Contact: <a href="mailto:info@open-meteo.com">info@open-meteo.com</a></p>
</div>
