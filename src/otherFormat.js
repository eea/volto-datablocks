export const OTHER_FORMAT = {
    SQUARE_TO_ITALIC: 'square_brackets_to_italics'
}

export const dataFormatChoices = [
  { id: OTHER_FORMAT.SQUARE_TO_ITALIC, label: 'Format square brackets pattern to italic'}
]

export const valueFormatters = {
    square_brackets_to_italics: (value) => {
        return value && typeof value === 'string' && 'whatever' || value;
    }
}

export function isOtherFormat(specifier) {
    let pass = false;
    
    for (const value of Object.values(OTHER_FORMAT)) {
        if (specifier === value) {
            pass = true;
            break;
        }
    }

    return pass;
}

export function otherFormat(specifier, value) {
    if (specifier === OTHER_FORMAT.SQUARE_TO_ITALIC) {
        return value.replace(/\[(.*?)\]/g, '<em>$1</em>');
    }
    
    return value;
}