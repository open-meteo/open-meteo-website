import fs from 'fs';
import { replaceInFileSync } from 'replace-in-file';

export const pullDomainData = (generateNewOptionFiles = true) => {
	return {
		name: 'pull-domain-data',
		transform(code, id, options) {
			if (id.includes('src/routes/en/docs') && id.endsWith('options.ts')) {
				if (options?.ssr) {
					if (id.includes('dwd-api')) {
						const basePath = id.replace('options.ts', '');
						const domainMetaData = JSON.parse(
							fs.readFileSync(basePath + 'meta-data-poc.json', 'utf8')
						);

						fetch('https://openmeteo.s3.amazonaws.com/data/dwd_icon/static/meta.json')
							.then((response) => response.json())
							.then(function (response) {
								console.log(response);
								let newHourly = `export const hourly = [
  [`;
								for (const [index, variable] of domainMetaData.variables.entries()) {
									newHourly += `
    { value: '${variable}', label: '${domainMetaData.labels[index]}' },`;
								}

								newHourly += `
  ]
];`;

								const regex = /export const hourly = \[[\s\S]*?\];/;

								if (generateNewOptionFiles) {
									const replaceOptions = {
										files: id,
										from: regex,
										to: newHourly,
										countMatches: true
									};

									try {
										const results = replaceInFileSync(replaceOptions);
										console.log('Replacement results:', results);
									} catch (error) {
										console.error('Error occurred:', error);
									}
								} else {
									return code.replace(regex, newHourly);
								}
							});
					}
				}
			}
		}
	};
};
