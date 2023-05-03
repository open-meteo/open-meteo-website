<svelte:head>
	<title>About | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/about" />
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
	<h1 class="display-5" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">About</h1>
	<div class="col-lg-6 mx-auto" />
</div>

<div class="container col-xxl-8 px-4 py-5">
	<div class="row flex-lg-row align-items-top g-5 py-5">
		<div class="col-lg-6">
			<h2 class="display-5 lh-1 mb-3">About</h2>
			<p class="lead">
				Open-Meteo is an open-source weather API and offers free access for non-commercial use. No
				API key is required. You can use it immediately!
			</p>
			<p>
				We at Open-Meteo believe that access to accurate and reliable weather data should be
				available to everyone. That's why we have created an open-source weather API that utilizes
				open-data weather forecasts provided by national weather services. These numerical weather
				predictions are free to download, but working with them can be challenging due to the
				expertise required in binary file formats, grid-systems, projections, and the fundamentals
				of weather predictions.
			</p>
			<p>
				Our team has worked hard to create a user-friendly API that integrates high-resolution local
				and global weather models. Every day, over 2 TB of data are downloaded and processed from
				multiple national weather services. We then store the collected data in local files using a
				customized file format and compression technique to enhance access to time-series data such
				as a 14-day temperature forecast.
			</p>
			<p>
				Unlike other weather APIs, Open-Meteo provides complete access to its source code, and all
				data sources are openly listed, crediting the national weather services for their work. With
				Docker or prebuilt Ubuntu packages, users can launch their own weather API within minutes.
				By providing the source code, users can conduct detailed verifications of the weather data
				processing and even make modifications themselves. We welcome and encourage contributions
				from our users.
			</p>
			<p>
				The API is available for non-commercial use at no cost. Despite being free of charge, the
				forecast accuracy is top-notch. The API utilizes a vast array of local weather models with
				rapid updates, ensuring that the most precise forecast is generated for any location
				globally.
			</p>
			<p>
				Thank you for considering Open-Meteo for your weather data needs. We are always striving to
				improve and welcome any feedback or questions you may have. Please feel free to contact us
				at <a href="mailto:info@open-meteo.com">info@open-meteo.com</a>.
			</p>
		</div>
		<div id="contact" class="col-lg-6">
			<h2 class="display-5 lh-1 mb-3">Vision</h2>
			<p>
				At our core, we believe that weather information should be freely available to everyone.
				That's why we built our weather API on open data - making it accessible to all without any
				barriers. Our team of dedicated developers and weather experts work tirelessly to ensure
				that our API is accurate, reliable, and easy to use.
			</p>
			<p>
				We understand the importance of weather information in our daily lives. From planning a
				weekend getaway to making critical business decisions, accurate and up-to-date weather data
				can be the difference between success and failure. Our API delivers weather data in a
				variety of formats, making it easy for developers and businesses to integrate weather data
				into their applications and services.
			</p>
			<p>
				Our goal is to make weather data accessible to everyone - from hobbyists and startups to
				large corporations and government agencies. Whether you need weather information for
				personal or professional use, our API has got you covered. We are constantly adding new
				features and improving our API to better serve our users.
			</p>
			<p>
				Thank you for choosing our weather API. We look forward to providing you with the most
				accurate and reliable weather information available.
			</p>
		</div>
		<div id="contact" class="col-lg-6">
			<h2 class="display-5 lh-1 mb-3">Contact</h2>
			<p>
				We're thrilled that you're interested in contacting us! Whether you have a question,
				comment, or just want to say hello, we're always here to listen and help.
			</p>

			<p>
				At our core, we believe that communication is key to building strong relationships with our
				users. That's why we've made it easy for you to get in touch with us. You can reach us
				through any of the following channels:
			</p>
			<ul>
				<li>
					Email: Shoot us an email at <a href="mailto:info@open-meteo.com">info@open-meteo.com</a>.
					Our friendly team will get back to you as soon as possible.
				</li>
				<li>
					Social Media: You can also connect with us on social media. Follow us on <a
						rel="me"
						href="https://twitter.com/open_meteo">Twitter</a
					>
					or <a rel="me" href="https://fosstodon.org/@openmeteo">Mastodon</a> and send us a message.
					We'd love to hear from you!
				</li>
				<li>
					GitHub: Engage with other developers and data-scientists at <a
						href="https://github.com/open-meteo/open-meteo/discussions">GitHub Discussions</a
					>.
				</li>
			</ul>
			<p>
				We're committed to providing our users with the best possible experience. That's why we're
				always looking for feedback on how we can improve. Whether you have a suggestion for a new
				feature or just want to let us know how we're doing, we're all ears.
			</p>
			<p>
				So don't be shy - drop us a line and let us know how we can help. We're excited to hear from
				you!
			</p>
		</div>
	</div>
</div>
