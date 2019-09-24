import * as vscode from "vscode";

export let text = "";

export function append(input: string): void {
  text += input;
  vscode.commands.executeCommand("setContext", "vsVim.hasInput", true);
}

export function clear(): void {
  text = "";
  vscode.commands.executeCommand("setContext", "vsVim.hasInput", false);
}

export function number(): number {
  return parseInt(text, 10) || 1;
}
