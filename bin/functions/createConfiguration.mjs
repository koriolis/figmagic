import fs from 'fs';

import { config } from './../meta/config.mjs';
import { parseCliArgs } from './parseCliArgs.mjs';

/**
 * Create configuration object
 *
 * Prioritization:
 * 1. User-provided configuration through `.figmagicrc`
 * 2. Command-line arguments and flags
 * 3. Environment variables from `.env`
 * Non-provided values should fall back to defaults outlined in `meta/config.mjs`
 *
 * @exports
 * @async
 * @function
 * @param {string} userConfigPath - Path to user configuration file, based out of user's current working directory
 * @param {string} envToken - Figma API token through environment variable
 * @param {string} envUrl - Figma URL through environment variable
 * @param {array} cliArgs - Array of any user-provided command line arguments and flags
 * @returns {object} - The final, validated and collated configuration object
 */
export async function createConfiguration(userConfigPath, ...cliArgs) {
	// Set default values first
	const DEFAULT_CONFIG = {
		debugMode: false,
		fontUnit: config.defaultFontUnit,
		outputFileName: config.defaultOutputOutputFileName,
		outputFolderBaseFile: config.defaultOutputFolderBaseFile,
		outputFolderTokens: config.defaultOutputFolderTokens,
		outputTokenFormat: config.defaultOutputTokenFormat,
		spacingUnit: config.defaultSpacingUnit,
		token: process.env.FIGMA_TOKEN ? process.env.FIGMA_TOKEN : null,
		url: process.env.FIGMA_URL ? process.env.FIGMA_URL : null,
		usePostscriptFontNames: config.defaultUsePostscriptFontNames
	};

	// Env var configuration
	// Lowest priority
	const ENV_CONFIG = {
		token: DEFAULT_CONFIG.token,
		url: DEFAULT_CONFIG.url
	};

	console.log('ENV_CONFIG');
	console.log(ENV_CONFIG);

	// CLI arguments configuration
	// Medium priority
	const CLI_CONFIG = parseCliArgs(cliArgs);
	console.log('CLI_CONFIG');
	console.log(CLI_CONFIG);

	// RC file configuration
	// Highest priority
	let RC_CONFIG = undefined;

	// Check for, and read, any existing user configuration
	await new Promise((resolve, reject) => {
		if (fs.existsSync(userConfigPath)) {
			try {
				fs.readFile(userConfigPath, 'utf8', (err, data) => {
					if (err) throw new Error(err);
					RC_CONFIG = JSON.parse(data);
					resolve();
				});
			} catch (error) {
				console.error(error);
				reject();
			}
		}
	});

	console.log('RC_CONFIG');
	console.log(RC_CONFIG);

	console.log('—————');

	const CONFIG = { ...DEFAULT_CONFIG, ...ENV_CONFIG, ...CLI_CONFIG, ...RC_CONFIG };
	console.log('CONFIG');
	console.log(CONFIG);

	return CONFIG;
}
