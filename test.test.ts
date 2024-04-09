import { assert, describe, expect, it } from "vitest";
import { TypeSpecProblemMatchRegex } from "./regex";
import pc from "picocolors";

describe("match errors", () => {
  it.each([
    ["colored", true],
    ["plain", false],
  ])("%s", (_, colored) => {
    const color = (str: string) => (colored ? pc.red(str) : str);

    const content = `${color("/home/runner/work/tsp-playground/tsp-playground/main.tsp")}:${color("4")}:${color("12")} - ${color("error")} ${color("unknown-identifier")}: ${color("Unknown identifier abc")}`;
    const match = content.match(new RegExp(TypeSpecProblemMatchRegex));
    assert(match !== null, "match is null");
    expect(match[1]).toEqual(
      "/home/runner/work/tsp-playground/tsp-playground/main.tsp"
    );
    expect(match[2]).toEqual("4");
    expect(match[3]).toEqual("12");
    expect(match[4]).toEqual("error");
    expect(match[5]).toEqual("unknown-identifier");
    expect(match[6]).toEqual("Unknown identifier abc");
  });
});

describe("match warnings", () => {
  it.each([
    ["colored", true],
    ["plain", false],
  ])("%s", (_, colored) => {
    const color = (str: string) => (colored ? pc.red(str) : str);

    const content = `${color("/home/runner/work/tsp-playground/tsp-playground/main.tsp")}:${color("4")}:${color("12")} - ${color("warning")} ${color("unknown-identifier")}: ${color("Unknown identifier abc")}`;
    const match = content.match(new RegExp(TypeSpecProblemMatchRegex));
    assert(match !== null, "match is null");
    expect(match[1]).toEqual(
      "/home/runner/work/tsp-playground/tsp-playground/main.tsp"
    );
    expect(match[2]).toEqual("4");
    expect(match[3]).toEqual("12");
    expect(match[4]).toEqual("warning");
    expect(match[5]).toEqual("unknown-identifier");
    expect(match[6]).toEqual("Unknown identifier abc");
  });
});

describe("match with code preview", () => {
  it.each([
    ["colored", true],
    ["plain", false],
  ])("%s", (_, colored) => {
    const color = (str: string) => (colored ? pc.red(str) : str);

    const content = [
      `${color("/home/runner/work/tsp-playground/tsp-playground/main.tsp")}:${color("4")}:${color("12")} - ${color("error")} ${color("unknown-identifier")}: ${color("Unknown identifier abc")}`,
      "> 4 | op test(): abc;",
      "    |            ^^^",
    ].join("\n");
    const match = content.match(new RegExp(TypeSpecProblemMatchRegex));
    assert(match !== null, "match is null");
    expect(match[1]).toEqual(
      "/home/runner/work/tsp-playground/tsp-playground/main.tsp"
    );
    expect(match[2]).toEqual("4");
    expect(match[3]).toEqual("12");
    expect(match[4]).toEqual("error");
    expect(match[5]).toEqual("unknown-identifier");
    expect(match[6]).toEqual("Unknown identifier abc");
  });
});
