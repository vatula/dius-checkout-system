import {DefaultPricingRule} from '../src/rules/default';

describe('DefaultPricingRule', () => {
  it('should throw on unknown sku', () => {
    const pricingRule = new DefaultPricingRule(new Map([]));
    expect(() => pricingRule.apply(['mbp'])).toThrow('unknown sku: mbp');
  });

  it('given known sku should return price from the provided map', () => {
    const pricingRule = new DefaultPricingRule(new Map<string, number>([['mbp', 120]]));
    expect(pricingRule.apply(['mbp'])).toEqual([['mbp', 120]]);
  });
});
