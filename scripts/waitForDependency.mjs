#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import { execaCommandSync as commandSync } from "execa";

const findContainerId = (node) => {
  const cmd = `
  docker ps \
    --filter "status=running" \
    --filter "label=custom.project=mates-rates" \
    --filter "label=custom.service=${node}" \
    --no-trunc \
    -q
  `;
  const containerId = commandSync(cmd, {shell: true}).stdout.toString("utf-8");
  if (containerId) {
    console.log(`${node}: ${containerId}`);
    return containerId
  } else {
    throw new Error(`Could not find container id for ${node}`)
  }
}

console.log("\nFinding container ids....")
findContainerId("postgres")

console.log("\nAll nodes up")
console.log(
  commandSync(`docker compose -f ${process.env.COMPOSE_FILE} ps`, {
    shell: true
  }).stdout.toString("utf-8")
);

console.log("Finished!")
