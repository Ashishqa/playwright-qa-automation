/**
 * PriceHelper class provides utility methods for handling currency price strings.
 * Handles parsing, formatting, and calculations with price strings containing "$".
 */
export class PriceHelper {
  /**
   * Parse a price string (e.g., "$905.99") and return as a number.
   * Removes "$" and comma separators, then converts to float.
   *
   * @param {string} priceStr - Price string with or without "$" (e.g., "$1,234.99" or "905.99")
   * @returns {number} Parsed price as a number (e.g., 905.99)
   * @example
   * PriceHelper.parsePrice("$905.99"); // 905.99
   * PriceHelper.parsePrice("$1,234.50"); // 1234.50
   */
  static parsePrice(priceStr) {
    if (!priceStr || typeof priceStr !== 'string') {
      throw new Error(`Invalid price string: ${priceStr}`);
    }
    const parsed = parseFloat(priceStr.replace(/[$,]/g, ''));
    if (isNaN(parsed)) {
      throw new Error(`Unable to parse price string: ${priceStr}`);
    }
    return parsed;
  }

  /**
   * Format a number as a currency string (e.g., 905.99 → "$905.99", 123.10 → "$123.1").
   * Always includes 2 decimal places initially, then removes trailing zeros.
   * "$" prefix.
   *
   * @param {number} amount - Amount to format as currency
   * @returns {string} Formatted price string with "$" prefix (e.g., "$905.99" or "$123.1")
   * @example
   * PriceHelper.formatPrice(905.99); // "$905.99"
   * PriceHelper.formatPrice(123.10); // "$123.1"
   * PriceHelper.formatPrice(100); // "$100"
   */
  static formatPrice(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error(`Invalid amount: ${amount}`);
    }
    // Format to 2 decimals, then remove trailing zeros and unnecessary decimal point
    const formatted = amount.toFixed(2).replace(/\.?0+$/, '');
    return `$${formatted}`;
  }

  /**
   * Sum multiple price strings and return the total as a number.
   * Each price string can have "$" and commas which are automatically handled.
   *
   * @param {...string} prices - Price strings to sum (e.g., "$100.00", "$50.50", "$25.99")
   * @returns {number} Total sum as a number (e.g., 176.49)
   * @example
   * PriceHelper.sumPrices("$100.00", "$50.50", "$25.99"); // 176.49
   * PriceHelper.sumPrices("$905.99", "$236.12", "$286.99"); // 1429.1
   */
  static sumPrices(...prices) {
    if (prices.length === 0) {
      return 0;
    }
    return prices.reduce((sum, price) => sum + this.parsePrice(price), 0);
  }

  /**
   * Sum multiple price strings and return the total as a formatted currency string.
   * Combines sumPrices() and formatPrice() for convenience.
   *
   * @param {...string} prices - Price strings to sum
   * @returns {string} Formatted total price with "$" prefix (e.g., "$176.49" or "$176")
   * @example
   * PriceHelper.sumAndFormatPrices("$100.00", "$50.50", "$25.99"); // "$176.49"
   * PriceHelper.sumAndFormatPrices("$100.00", "$50.00"); // "$150"
   */
  static sumAndFormatPrices(...prices) {
    const total = this.sumPrices(...prices);
    return this.formatPrice(total);
  }

  /**
   * Compare two price strings for equality (accounting for formatting differences).
   * Parses both and compares the numeric values.
   *
   * @param {string} price1 - First price string to compare
   * @param {string} price2 - Second price string to compare
   * @returns {boolean} True if prices are equal when parsed
   * @example
   * PriceHelper.comparePrices("$100.50", "$100.50"); // true
   * PriceHelper.comparePrices("$100.50", "$100.51"); // false
   */
  static comparePrices(price1, price2) {
    return this.parsePrice(price1) === this.parsePrice(price2);
  }

  /**
   * Apply a percentage discount to a price and return the discounted amount.
   *
   * @param {string} price - Original price string (e.g., "$100.00")
   * @param {number} discountPercent - Discount percentage (e.g., 10 for 10%)
   * @returns {number} Discounted price as a number
   * @example
   * PriceHelper.applyDiscount("$100.00", 10); // 90
   */
  static applyDiscount(price, discountPercent) {
    const parsedPrice = this.parsePrice(price);
    const discount = (parsedPrice * discountPercent) / 100;
    return parsedPrice - discount;
  }

  /**
   * Apply a percentage discount and return as formatted currency string.
   *
   * @param {string} price - Original price string
   * @param {number} discountPercent - Discount percentage
   * @returns {string} Formatted discounted price
   * @example
   * PriceHelper.applyDiscountFormatted("$100.00", 10); // "$90.00"
   */
  static applyDiscountFormatted(price, discountPercent) {
    const discountedPrice = this.applyDiscount(price, discountPercent);
    return this.formatPrice(discountedPrice);
  }
}
