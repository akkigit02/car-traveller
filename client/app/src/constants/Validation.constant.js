
export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i,
  message: "Invalid email address.",
};

export const passwordPattern = {
  value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/,
  message: "Password must include lowercase, uppercase, number and special character.",
};

export const phonePattern = {
  value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  message: "Invalid phone number."
};

export const phoneNumberValidation = {
    required: "Phone number is required.",
    minLength: {
        value: 10,
        message: "Phone number must have 10 digits",
    },
};

export const phoneNumberShortValidation = {
  minLength: {
      value: 10,
      message: "Phone number must have 10 digits",
  },
};

export const phoneLengthValidation = {
    minLength: {
        value: 10,
        message: "Phone number must have 10 digits",
    },
}

export const faxNumberValidation = {
  minLength: {
    value: 10,
    message: "Fax number must have 10 digits",
  },
}

export const linkNamePattern = {
  value: /^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9_+-]*)?$/gu,
  message: "Invalid name."
}

export const namePattern = {
  value: /^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*)?$/gu,
  message: "Invalid name."
}

export const websitePattern = {
  value: /^(?:(?:https?|ftp):\/\/)|(www.)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
  message: "Invalid website"
};

export const spaceValidation = {
  value: /^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*)?$/gu,
  message: "Invalid input"
}

export const spaceValidationWithNewLine = {
  value: /^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\n]*)?$/gu,
  message: "Invalid input"
}

// export const noSpacesAtTheBeginning = {
//   value: /^[^\s]+(\s+[^\s]+)*$/gu,
//   message: "Invalid input"
// }

export const noSpacesAtTheBeginning = {
  value: /[a-zA-Z0-9]/g,
  message: "Invalid input"
}

export const invalidPassword = {
  value: /^(?!\s+$).*/gm,
  message: "Invalid Password."
}

export const startsWithNoSpaces = {
  value: /^\S*$/gm,
  message: "Invalid input"
}
///^[^-\s][a-zA-Z0-9 !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]+$/gm

export const onlyNumbers = {
    value: /^[0-9]*$/,
    message: 'Only Digits allowed'
}

// export const datePattern = {
//   value: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])/,
//   message: "Invalid date and month.",
// };
