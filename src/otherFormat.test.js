import { OTHER_FORMAT, otherFormat, isOtherFormat } from "./otherFormat";

describe('otherFormat', () => {
    it('should convert [text] to <em>text</em>', () => {
        const input = 'This is [italic] text.';
        const expected = 'This is <em>italic</em> text.';
        expect(otherFormat(OTHER_FORMAT.SQUARE_TO_ITALIC, input)).toBe(expected);
    });

    it('should convert multiple [text] instances', () => {
        const input = '[First] and [Second]';
        const expected = '<em>First</em> and <em>Second</em>';
        expect(otherFormat(OTHER_FORMAT.SQUARE_TO_ITALIC, input)).toBe(expected);
    });

    it('should return the original string if no brackets are present', () => {
        const input = 'No brackets here.';
        expect(otherFormat(OTHER_FORMAT.SQUARE_TO_ITALIC, input)).toBe(input);
    });

    it('should return the original string if specifier is not SQUARE_TO_ITALIC', () => {
        const input = 'This is [ignored].';
        expect(otherFormat('other-specifier', input)).toBe(input);
    });

    it('should handle empty brackets', () => {
        const input = 'Empty [] brackets';
        const expected = 'Empty <em></em> brackets';
        expect(otherFormat(OTHER_FORMAT.SQUARE_TO_ITALIC, input)).toBe(expected);
    });
});

describe('isOtherFormat', () => {
    it('should return true for SQUARE_TO_ITALIC', () => {
        expect(isOtherFormat(OTHER_FORMAT.SQUARE_TO_ITALIC)).toBe(true);
    });

    it('should return false for unknown specifier', () => {
        expect(isOtherFormat('unknown-specifier')).toBe(false);
    });

    it('should return false for empty string', () => {
        expect(isOtherFormat('')).toBe(false);
    });

    it('should return false for null', () => {
        expect(isOtherFormat(null)).toBe(false);
    });

    it('should return false for undefined', () => {
        expect(isOtherFormat(undefined)).toBe(false);
    });
});