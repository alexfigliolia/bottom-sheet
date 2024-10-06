import { Builder } from "../build/Builder";

(async () => {
  await Builder.build();
})().catch(console.log);
