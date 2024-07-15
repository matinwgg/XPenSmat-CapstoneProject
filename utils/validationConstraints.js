// Formfields validations
import { validate } from "validate.js"

export const validateAllFields = (id, value) => {
    const constraints = {
        presence: {
            allowEmpty: false,
        }
    }
    if (value !== "") {
        constraints.format = {
            pattern: ".+",
            flags: "i",
            message: "Field can't be empty"
        }
    }

    const validationResult = validate( {[id]: value }, {[id]: constraints})

    return validationResult && validationResult[id]
}


export const validateEmailField = (id, value) => {
    const constraints = {
        presence: {
            allowEmpty: false,
        }
    }
    if (value !== "") {
        constraints.email = true
    }

    const validationResult = validate( {[id]: value }, {[id]: constraints})

    return validationResult && validationResult[id]
}

export const validatePasswordField = (id, value) => {
    const constraints = {
        presence: {
            allowEmpty: false,
        }
    }
    if (value !== "") {
        constraints.length = {
            minimum: 6,
            message: "Must be at least 6 characters" 
        }
    }

    const validationResult = validate( {[id]: value }, {[id]: constraints})

    return validationResult && validationResult[id]
}