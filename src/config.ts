/** Total trials to use in results. */
export const trials = 100_000;

/** Number of trials to perform as warmup period, these are discarded. */
export const skip = 500;

/**
 * Human readable titles for different types of benchmarks performed on each library.
 */
export enum BenchmarkTitles {
	/** Converting inches to feet. */
	InchesToFeet = 'Inches to feet',
	FractionLitersToCubicInches = 'Fractional liters to cubic inches',
	BigIntConversion = 'Converting hours to minutes, but with `BigInt`s'
}
