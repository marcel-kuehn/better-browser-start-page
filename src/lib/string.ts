export const replacePlaceholder = (text: string, placeholder: string, value: string) => {
  return text.replace(`{${placeholder}}`, value)
}
