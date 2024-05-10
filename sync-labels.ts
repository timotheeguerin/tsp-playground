import { readFile } from "fs/promises";
import { parse } from "yaml";
import { Octokit } from "@octokit/rest";
import { inspect } from "util";
const labelFile = "labels.yaml";

const repo = {
  owner: "timotheeguerin",
  repo: "tsp-playground",
};
await main();

interface Label {
  name: string;
  color: string;
  description: string;
}

async function main() {
  const content = await readFile(labelFile, "utf8");
  const labels = parse(content);
  console.log("Labels:", labels);
  for (const label of labels) {
    validateLabel(label);
  }

  const octokit = new Octokit();
  const existingLabels = await fetchAllLabels(octokit);
  console.log("Existing labels", existingLabels);
  const labelToUpdate: Label[] = [];
  const labelsToCreate: Label[] = [];
  const exitingLabelMap = new Map(
    existingLabels.map((label) => [label.name, label])
  );
  for (const label of labels) {
    const existingLabel = exitingLabelMap.get(label.name);
    if (existingLabel) {
      if (
        existingLabel.color !== label.color ||
        existingLabel.description !== label.description
      ) {
        labelToUpdate.push(label);
      }
    } else {
      labelsToCreate.push(label);
    }
    exitingLabelMap.delete(label.name);
  }
  const labelsToDelete = Array.from(exitingLabelMap.values()).map(
    (x) => x.name
  );
  console.log("Labels to update", labelToUpdate);
  console.log("Labels to create", labelsToCreate);
  console.log("Labels to delete", labelsToDelete);
  await updateLabels(octokit, labelToUpdate);
  await createLabels(octokit, labelsToCreate);
  await deleteLabels(octokit, labelsToDelete);
}

async function fetchAllLabels(octokit: Octokit) {
  const result = await octokit.paginate(
    octokit.rest.issues.listLabelsForRepo,
    repo
  );
  return result;
}

async function createLabels(octokit: Octokit, labels: Label[]) {
  for (const label of labels) {
    await octokit.rest.issues.createLabel({ ...repo, ...label });
    console.log(
      `Created label ${label.name}, color: ${label.color}, description: ${label.description}`
    );
  }
}
async function updateLabels(octokit: Octokit, labels: Label[]) {
  for (const label of labels) {
    await octokit.rest.issues.updateLabel({ ...repo, ...label });
    console.log(
      `Updated label ${label.name}, color: ${label.color}, description: ${label.description}`
    );
  }
}
async function deleteLabels(octokit: Octokit, labels: string[]) {
  for (const name of labels) {
    await octokit.rest.issues.deleteLabel({ ...repo, name });
    console.log(`Deleted label ${name}`);
  }
}

function validateLabel(label: Label) {
  if (label.name === undefined) {
    throw new Error(`Label missing name: ${inspect(label)}`);
  }
  if (label.color === undefined) {
    throw new Error(`Label missing color: ${inspect(label)}`);
  }
  if (label.description === undefined) {
    throw new Error(`Label missing description: ${inspect(label)}`);
  }
}
