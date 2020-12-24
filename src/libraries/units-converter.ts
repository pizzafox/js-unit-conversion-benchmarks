import {length, volume} from 'units-converter/dist/es/index.js';
import {BenchmarkTitles} from '../config.js';

export const name = 'units-converter';

export default {
	[BenchmarkTitles.InchesToFeet]() {
		return length(1024).from('in').to('ft').value;
	},
	[BenchmarkTitles.FractionLitersToCubicInches]() {
		return volume(4.2).from('l').to('in3').value;
	}
};
