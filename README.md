# Open-meteo.com Website

[![Build](https://github.com/open-meteo/open-meteo-website/actions/workflows/build.yml/badge.svg)](https://github.com/open-meteo/open-meteo-website/actions/workflows/build.yml)[![GitHub license](https://img.shields.io/github/license/open-meteo/open-meteo-website)](https://github.com/open-meteo/open-meteo-website/blob/main/LICENSE)

This repository contains the [open-meteo.com](https://open-meteo.com/) website. The weather API code can be found in [this](https://github.com/open-meteo/open-meteo) repository.

The website is build using SvelteKit, Bootstrap and Highcharts. It can be run locally using `npm`, is entirely static and hosted on a CDN afterwards.

TODO:
- Automatic code generation for python library

## Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`. The production build is automatically build using GitHub actions and automatically deployed to a CDN.

## Contributing

Contributions are always welcome! Please create an issue ticket to discuss larger changes.


## License

Open-Meteo is open-source under the GNU Affero General Public License Version 3 (AGPLv3) or any later version. You can [find the license here](LICENSE). Exceptions are third party source-code with individual licensing in each file.
