import { lstatSync, mkdirSync, readdirSync, renameSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDirPath = resolve(__dirname, '../build/');

// Search for abcd.html files and move them to abcd/index.html
function walk(directory) {
	const files = readdirSync(directory);
	files.forEach((file) => {
		const absolute = `${directory}/${file}`;
		if (lstatSync(absolute).isDirectory()) {
			walk(absolute);
			return;
		}

		const parts = file.split('.');
		if (parts.length != 2) {
			return;
		}
		if (parts[0] == 'index' || parts[1] != 'html') {
			return;
		}

		const newDirectory = `${directory}/${parts[0]}`;
		const newFile = `${newDirectory}/index.html`;
		console.log(`Rename ${file} to ${parts[0]}/index.html`);
		mkdirSync(newDirectory, { recursive: true });
		renameSync(absolute, newFile);
	});
}

walk(buildDirPath);
