import * as vscode from "vscode";

export let text = "";

export function append(input: string): void {
  text += input;
  vscode.commands.executeCommand("setContext", "vsVim.hasInput", true);
}

export function appendNonZeroNumber(str: string): void {
  // current input is blank or starts with number
  if (text === "" || parseInt(str, 10)) {
    append(str);
  }
}

export function clear(): void {
  text = "";
  vscode.commands.executeCommand("setContext", "vsVim.hasInput", false);
}

export function number(): number | null {
  return parseInt(text, 10) || null;
}

export function isBlank(): boolean {
  return text.length === 0;
}

export function testWith(regexp: RegExp): boolean {
  return regexp.test(text);
}
