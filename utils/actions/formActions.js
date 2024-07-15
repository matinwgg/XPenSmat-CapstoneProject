import { validateAllFields, validateEmailField, validatePasswordField } from "../validationConstraints"

export const validateInput = (inputId, inputValue) => {
    if (inputId === "username") {
        return validateAllFields(inputId, inputValue)
    } else if (inputId === "email") {
        return validateEmailField(inputId, inputValue)
    } else if (inputId === "password" || inputId === "passwordConfirm") {
        return validatePasswordField(inputId, inputValue)
    }
}