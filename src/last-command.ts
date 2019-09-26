export let operator = "";
export let insertText = "";
export let clearInsertTextOnNextInsert = false;

export function get(): string {
  return operator + insertText;
}

export function setOperator(str: string): void {
  clearInsertText();
  operator = str;
}

export function appendToInsertText(str: string): void {
  insertText += str;
}

export function clearInsertText(): void {
  insertText = "";
}

export function setClearTextOnNextInsert(bool: boolean) {
  clearInsertTextOnNextInsert = bool;
}
