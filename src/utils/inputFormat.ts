export function nextDigit(
  input: string,
  cursorpos: number,
  isBackspace: boolean,
) {
  if (isBackspace) {
    for (let i = cursorpos - 1; i > 0; i--) {
      if (/\d/.test(input[i])) {
        return i;
      }
    }
  } else {
    for (let i = cursorpos - 1; i < input.length; i++) {
      if (/\d/.test(input[i])) {
        return i;
      }
    }
  }

  return cursorpos;
}

export function naturalFormat(phoneNumberString: string) {
  try {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{0,})?/);
    if (match) {
      return [match[1] || ""].join("");
    } else {
      return "";
    }
  } catch (err) {
    return "";
  }
}

export function ssnFormat(phoneNumberString: string) {
  try {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{0,3})?(\d{0,2})?(\d{0,4})?/);
    if (match) {
      return [
        match[1] || "",
        match[2] ? "-" : "",
        match[2] || "",
        match[3] ? "-" : "",
        match[3] || "",
      ].join("");
    } else {
      return "";
    }
  } catch (err) {
    return "";
  }
}

export function einFormat(phoneNumberString: string) {
  try {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{0,2})?(\d{0,7})?/);
    if (match) {
      return [match[1] || "", match[2] ? "-" : "", match[2] || ""].join("");
    } else {
      return "";
    }
  } catch (err) {
    return "";
  }
}
