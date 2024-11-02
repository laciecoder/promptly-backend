import Configuration from "openai";
export function configureAI() {
  const config = new Configuration({
    apiKey: process.env.OPEN_AI_SECRET,
    organization: process.env.OPEN_AI_ORG_ID,
  });
  console.log(config);
  return config;
}
