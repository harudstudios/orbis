import Exa from "exa-js";

let exaInstance: Exa | null = null;

export function getExaClient(): Exa {
  if (!exaInstance) {
    exaInstance = new Exa(process.env.EXA_API_KEY);
  }
  return exaInstance;
}
