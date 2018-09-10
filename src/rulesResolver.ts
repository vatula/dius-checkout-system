import {IPricingRule} from './pricingRule';

export class RulesResolver implements IPricingRule {
  private readonly rules: Array<IPricingRule> = [];
  constructor(...rules: Array<IPricingRule>) {
    this.add(...rules);
  }
  add(...rules: Array<IPricingRule>): this {
    this.rules.push(...rules);
    return this;
  }

  apply(items: Array<string>): Array<[string, number]> {
    const normalizedMatrix = this.getPricelistMatrix(items);
    return normalizedMatrix.map(([sku, prices]) => [sku, Math.min(...prices)] as [string, number]);
  }

  protected getPricelistMatrix(items: Array<string>): Array<[string, Array<number>]> {
    const pricelistMatrix: Array<Array<[string, number]>> = this.rules.map((rule) => rule.apply(items));
    const normalizedMatrix: Array<[string, Array<number>]> = [];
    pricelistMatrix.forEach((pricelist, ruleNum) => {
      pricelist.forEach(([sku, price], index) => {
        if (!(this.constructor as typeof RulesResolver).isValidPrice(price)) {
          throw new Error(`price for the rule # ${ruleNum + 1} is invalid (the value is ${price}). It needs to be between 0 and ${Number.MAX_SAFE_INTEGER}`);
        }
        if (!normalizedMatrix[index]) {
          const prices = new Array(pricelistMatrix.length).fill(Number.MAX_SAFE_INTEGER);
          prices[ruleNum] = price;
          normalizedMatrix[index] = [sku, prices];
        } else if (normalizedMatrix[index][0] !== sku) {
          const prices = new Array(pricelistMatrix.length).fill(Number.MAX_SAFE_INTEGER);
          prices[ruleNum] = price;
          normalizedMatrix.push([sku, prices]);
        } else {
          const prices = normalizedMatrix[index][1];
          prices[ruleNum] = price;
        }
      });
    });
    return normalizedMatrix;
  }

  protected static isValidPrice(price: number): boolean {
    return (typeof price === 'number' && price >= 0 && Number.isSafeInteger(Math.ceil(price)));
  }
}
