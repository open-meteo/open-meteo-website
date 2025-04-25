<script lang="ts">
</script>

<svelte:head>
	<title>🧑‍⚖️ Terms | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/terms" />
	<meta
		name="description"
		content="Terms of Use of Open-Meteo the open-source weather API that offers free access for non-commercial use. No API key required. Our user-friendly API integrates high-resolution local and global weather models, providing accurate forecasts for any location worldwide. We believe in making weather information accessible to everyone and encourage contributions from our users. Contact us via email, social media, or GitHub for any inquiries or feedback. Join us in our mission to provide the most accurate and reliable weather data available."
	/>
</svelte:head>

<div class="container my-6 lg:my-12">
	<div>
		<h2 id="terms" class="mb-3 text-3xl font-light lg:mb-5 lg:text-5xl">Terms of Use</h2>
		<p>
			Open-Meteo assumes no responsibility for any inaccuracies or omissions in the data, their
			availability, or any losses or damages resulting from their usage. The accuracy and
			completeness of the data products and their uninterrupted provision are not guaranteed by
			Open-Meteo, and they are provided without any warranty, either statutory or otherwise. In any
			event, Open-Meteo disclaims all liability under these Terms of Use, whether arising from
			contract, tort, or any other cause.
		</p>
		<div class="my-3 grid gap-6 md:my-6 md:grid-cols-2 md:gap-12">
			<div class="[&_p]:mt-3">
				<h3 id="non_commercial_use" class="mb-3 text-xl font-light lg:text-2xl">
					Non-Commercial Use
				</h3>
				<p>By using the Free API for non-commercial use you agree to following terms:</p>
				<ul class="ml-6 list-disc">
					<li>Less than 10'000 API calls per day, 5'000 per hour and 600 per minute.</li>
					<li>You may only use the free API services for non-commercial purposes.</li>
					<li>
						You accept to the CC-BY 4.0 license, as specified in the <a
							class="text-link underline"
							href={'/en/license'}
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
				<ul class="ml-6 list-disc">
					<li>
						Using our service for private or non-profit websites or apps that do not have
						subscriptions or advertising.
					</li>
					<li>Utilizing our service for personal home automation purposes.</li>
					<li>Using our service for public research conducted at public institutions.</li>
					<li>Incorporating our service into educational content.</li>
				</ul>
				<p>On the other hand, the following examples are considered commercial use:</p>
				<ul class="ml-6 list-disc">
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
			<div class="[&_p]:mt-3">
				<h3 id="api_subcription" class="mb-3 text-xl font-light lg:text-2xl">API Subscription</h3>
				<p>
					When using the <a
						href={'/en/pricing'}
						title="Pricing information to use the weather API commercially">paid API subscription</a
					>, you agree to the following terms:
				</p>
				<ul class="ml-6 list-disc">
					<li>
						By subscribing to our service, you authorize us to charge the applicable subscription
						fees through the payment gateway Stripe.
					</li>
					<li>
						You agree to provide accurate and up-to-date payment information and promptly update it
						if there are any changes.
					</li>
				</ul>
				<p>Account and Security:</p>
				<ul class="ml-6 list-disc">
					<li>
						You are responsible for maintaining the confidentiality and security of your account
						login credentials.
					</li>
					<li>You agree not to share your account or login information with any third party.</li>
					<li>You are solely responsible for any activities that occur under your account.</li>
				</ul>
				<p>Intellectual Property:</p>
				<ul class="ml-6 list-disc">
					<li>
						All intellectual property rights in our SaaS service, including but not limited to
						software, content, and trademarks, belong to us.
					</li>
					<li>
						You are granted a limited, non-exclusive, and non-transferable license to use our
						service for the duration of your subscription.
					</li>
					<li>
						The data obtained through the API is provided under the terms of the CC-BY 4.0 license,
						as specified in the <a
							class="text-link underline"
							href={'/en/license'}
							title="Open-Meteo further license details">license conditions</a
						>.
					</li>
				</ul>
				<p>Limitation of Liability:</p>
				<ul class="ml-6 list-disc">
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
						Our total liability, if any, shall be limited to the amount you paid for the
						subscription fee during the twelve months preceding the claim.
					</li>
				</ul>
				<p>Termination:</p>
				<ul class="ml-6 list-disc">
					<li>
						Either party may terminate the subscription at the end of each payment schedule, for any
						reason, with or without notice.
					</li>
					<li>
						Upon missed payments, we reserve the right to terminate the subscription and access to
						our service after 14 days.
					</li>
					<li>
						Upon termination, your access to the service and any associated data may be immediately
						deactivated.
					</li>
				</ul>
			</div>
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

	<div class="overflow-auto overflow-y-hidden -mx-6 md:ml-0 lg:mx-0">
		<table
			class="[&_tr]:border-border mx-6 md:ml-0 lg:mx-0 mt-2 min-w-[1040px] w-full caption-bottom text-left [&_td]:px-1 [&_td]:py-2 [&_th]:py-2 [&_th]:pr-2 [&_tr]:border-b"
		>
			<thead>
				<tr>
					<th scope="col" style="width: 20%"> </th>
					<th scope="col" style="width: 20%">Free / Open-Access</th>
					<th scope="col" style="width: 20%">API Standard</th>
					<th scope="col" style="width: 20%">API Professional</th>
					<th scope="col" style="width: 20%">API Enterprise</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">Commercial use</th>
					<td>&#x274c;</td>
					<td>&#x2705;</td>
					<td>&#x2705; </td>
					<td>&#x2705; </td>
				</tr>
				<tr>
					<th scope="row">Minutely Limit</th>
					<td>&#x26a0;&#xfe0f; 600 calls / min</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
				</tr>
				<tr>
					<th scope="row">Hourly Limit</th>
					<td>&#x26a0;&#xfe0f; 5.000 calls / hour</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
				</tr>
				<tr>
					<th scope="row">Daily Limit</th>
					<td>&#x26a0;&#xfe0f; 10.000 calls / day</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
				</tr>
				<tr>
					<th scope="row">Monthly Limit</th>
					<td>&#x26a0;&#xfe0f; 300.000 calls / month</td>
					<td>&#x26a0;&#xfe0f; 1M calls / month</td>
					<td>&#x26a0;&#xfe0f; 5M calls / month</td>
					<td>&#x2705; >50M calls / month</td>
				</tr>
				<!-- <tr>
					<th scope="row">Concurrency</th>
					<td>&#x26a0;&#xfe0f; 5 max.</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
					<td>&#x2705; Unlimited</td>
				</tr> -->
			</tbody>
		</table>
	</div>

	<h2 id="privacy" class="mb-3 mt-6 text-3xl font-light lg:mb-5 lg:mt-12 lg:text-5xl">Privacy</h2>
	<p>
		By using our service, you consent to the terms of our privacy policy and agree that we may
		collect non-personal information as outlined below. If you have any questions or concerns about
		our privacy policy, please contact us.
	</p>
	<div class="my-3 grid gap-6 md:my-6 md:grid-cols-2 md:gap-12">
		<div>
			<h3 class="mb-3 text-xl font-light lg:text-2xl">Website of Open-Meteo.com</h3>
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
		<div>
			<h3 class="mb-3 text-xl font-light lg:text-2xl">Blog and Newsletter</h3>
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
		<div>
			<h3 class="mb-3 text-xl font-light lg:text-2xl">Free Non-Commercial API Service</h3>
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
		<div>
			<h3 class="mb-3 text-xl font-light lg:text-2xl">Subscription to Paid API Services</h3>
			<p>
				When you sign up for our paid API service and make payments through Stripe, we may collect
				the following information:
			</p>
			<ul class="ml-6 list-disc">
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

	<h2 id="operated_by" class="mb-3 mt-6 text-3xl font-light lg:mb-5 lg:mt-12 lg:text-5xl">
		Open-Meteo is operated by
	</h2>
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
