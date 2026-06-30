// hello-world-sdk is a dependency (see package.json). This user-owned custom code CALLS the SDK —
// the same idea as a real extension (e.g. a KYC function calling its SDK). The extension contract
// is input -> output (no navigation / app internals).
import { HelloWorldFunctions as HelloWorldSdk } from 'hello-world-sdk';

/**
 * HelloWorldFunctions — a custom extension that calls the hello-world-sdk.
 *
 * Contract: input -> output, identified by the name "HelloWorldFunctions.greet" (matches the
 * app-definition declaration: input { name }, output { message }). Registered in ./index.ts.
 */
export class HelloWorldFunctions {
  static greet = async (input: {
    name?: string;
  }): Promise<{ message: string }> => {
    const result = await HelloWorldSdk.greet(input);
    console.log('[HelloWorldFunctions] greet ->', result.message);
    return result;
  };
}
