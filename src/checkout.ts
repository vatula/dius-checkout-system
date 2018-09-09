import {IPricingRule} from './pricingRule';
import {RulesResolver} from './rulesResolver';

export interface ICheckout {
  scan(sku: string): void;
  total(): number;
  reset(): void;
}

export class Checkout implements ICheckout {
  private items: Array<string>;
  private readonly rules: RulesResolver;

  constructor(...pricingRules: Array<IPricingRule>) {
    this.rules = new RulesResolver(...pricingRules);
    this.reset();
  }

  scan(...sku: Array<string>): void {
    this.items.push(...sku);
  }

  total(): number {
    const pricelist = this.rules.apply(this.items);
    return pricelist.reduce((sum, [, price]) => sum + price, 0);
  }

  reset(): void {
    this.items = [];
  }
}
