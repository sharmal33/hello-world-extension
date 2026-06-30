/**
 * Custom Function Registry (custom-extension source).
 *
 * In a generated Sympler app this file is generator-owned; here it's the minimal version that
 * registers just the hello-world extension. The function file alongside it
 * (HelloWorldFunctions.ts) is user-owned and preserved across regeneration.
 */
import { HelloWorldFunctions } from './HelloWorldFunctions';

export const CustomFunctionRegistry: Record<
  string,
  (input: any) => Promise<any>
> = {
  'HelloWorldFunctions.greet': HelloWorldFunctions.greet,
};

/**
 * Execute a custom function by name. Contract: input -> output (the runtime resolves a function by
 * name and calls it with the mapped inputs; no navigation / app internals are passed).
 */
export async function executeCustomFunction(
  functionName: string,
  input: any,
): Promise<any> {
  const fn = CustomFunctionRegistry[functionName];
  if (!fn) {
    throw new Error(`Custom function not found: ${functionName}`);
  }
  return fn(input);
}
