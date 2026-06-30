# hello-world-extension

A **custom-extension source repo** for the App Studio custom-extension flow — it contains *only*
the user's custom code for the `helloWorld` extension, nothing else. The generator pulls this repo,
overlays the generated app, preserves the custom code, and merges `package.json`.

## Contents

```
package.json                       hello-world-sdk dependency (merged into the generated app)
src/extensions/
  HelloWorldFunctions.ts           user code: greet(input) -> output, CALLS hello-world-sdk
  index.ts                         registers "HelloWorldFunctions.greet"
```

- `HelloWorldFunctions.greet` is **input -> output** (`{ name } -> { message }`) and delegates to
  [`hello-world-sdk`](https://github.com/sharmal33/hello-world-sdk).
- The matching app definition declares the extension:
  ```ts
  app.useExtension({
    name: "helloWorld",
    functions: [
      { name: "greet", function: "HelloWorldFunctions.greet",
        input: { name: "string" }, output: { message: "string" } },
    ],
  });
  // trigger: setEvent(..., USER_EXT, "helloWorld.greet"); read $ext.helloWorld.greet.message
  ```

## How it's used

Point the generator's custom-extension config at this repo:

```
yarn generate-app ReactNative 0.79.1 <appId> \
 '{"customExtension":{"repoUrl":"https://github.com/sharmal33/hello-world-extension.git",
   "owner":"sharmal33","repo":"hello-world-extension","branch":"main", ...}}' <buildId>
```

The generator generates the app, keeps `src/extensions/HelloWorldFunctions.ts`, and adds
`hello-world-sdk` to the app's dependencies.
