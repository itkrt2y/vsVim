import * as vscode from "vscode";
import { type } from "./commands";
import { hasInput } from "./commands/normal";
import { goToNormalMode } from "./mode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand("type", type));
  context.subscriptions.push(
    vscode.commands.registerCommand("vsVim.goToNormalMode", goToNormalMode)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vsVim.hasInput", hasInput)
  );

  goToNormalMode();
}
