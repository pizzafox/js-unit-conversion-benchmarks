import {ascending, sortObject} from '@pizzafox/util';
import {convert} from 'convert';
import {readFile, writeFile} from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import prettierConfig from '../prettier.config.cjs';
import {runBenchmark} from './benchmark.js';
import {skip, trials} from './config.js';
import {baseDir, npmLink, replaceHtmlBlock, runtimeStats} from './util.js';

console.log('performing', trials + skip, 'trials and skipping the first', skip, 'trials');

const results = await runBenchmark(trials, skip);

console.log();
console.log('average execution time (lower is better):');

const markdownLines = [
	`Generated automatically at ${new Date().toUTCString()} with ${runtimeStats}`,
	'',
	`Each library was called ${skip.toLocaleString()} times to allow the runtime to warmup.`,
	`Afterward ${trials.toLocaleString()} trials were performed for each library.`,
	'The mean of the execution times are displayed in the tables below.'
];

for (const [title, benchmark] of Object.entries(results)) {
	console.log(`${title}:`);
	markdownLines.push(`### ${title}`, '', '| Library | Average execution time (lower is better) |', '| --- | --- |');

	/** Used to display data in the console. */
	const table: Record<string, string> = {};

	/** Benchmarks sorted by average execution time ascending. */
	const sortedBenchmark = sortObject(benchmark, ascending);

	/** The fastest speed of any library. */
	let fastest: number;

	for (const [library, averageExecutionTime] of Object.entries(sortedBenchmark)) {
		// Times are sorted ascending, so the first iteration is always the fastest library
		// This will only assign once
		fastest ??= averageExecutionTime;

		const executionTimeNs = Math.round(convert(averageExecutionTime).from('ms').to('ns')).toLocaleString();
		const percent = Math.round((averageExecutionTime / fastest) * 100);

		table[library] = `${executionTimeNs}ns`;
		markdownLines.push(`| ${npmLink(library)} | \`${executionTimeNs}\`ns (${percent}%) |`);
	}

	console.table(table);

	markdownLines.push('');
}

if (process.env.CI) {
	const markdown = markdownLines.join('\n');

	const readMePath = path.join(baseDir, '..', 'readme.md');
	const readMe = await readFile(readMePath, 'utf-8');

	const updatedReadme = prettier.format(replaceHtmlBlock(readMe, 'results', markdown), {filepath: readMePath, ...prettierConfig});

	await writeFile(readMePath, updatedReadme, 'utf-8');
}
