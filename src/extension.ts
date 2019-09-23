import * as vscode from "vscode";
import { type } from "./command";
import { goToNormal } from "./mode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand("type", type));
  context.subscriptions.push(
    vscode.commands.registerCommand("vsVim.goToNormalMode", goToNormal)
  );
}
