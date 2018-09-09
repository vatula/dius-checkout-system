import {Checkout} from '../src/checkout';
import {BulkDiscountIPD5} from '../src/rules/bulkDiscountIPD5';
import {DefaultPricingRule} from '../src/rules/default';
import {FreeVGAForEachMBP} from '../src/rules/freeVGAForEachMBP';
import {ThreeForTwoATV} from '../src/rules/threeForTwoATV';

describe('Checkout', () => {

  const defaultPricesRule = new DefaultPricingRule(new Map([
    ['ipd', 549.99],
    ['mbp', 1399.99],
    ['atv', 109.5],
    ['vga', 30]
  ]));

  const threeForTwoATVRule = new ThreeForTwoATV();

  const bulkDiscountIPD5Rule = new BulkDiscountIPD5();

  const freeVGAForEachMBPRule = new FreeVGAForEachMBP();

  it('should give proper totals', () => {
    const checkout = new Checkout(threeForTwoATVRule, defaultPricesRule, bulkDiscountIPD5Rule, freeVGAForEachMBPRule);

    checkout.scan('atv', 'atv', 'atv', 'vga');
    expect(checkout.total()).toEqual(249);
    checkout.reset();

    checkout.scan('atv', 'ipd', 'ipd');
    checkout.scan('atv', 'ipd', 'ipd', 'ipd');
    expect(checkout.total()).toEqual(2718.95);
    checkout.reset();

    checkout.scan('mbp', 'vga', 'ipd');
    expect(checkout.total()).toEqual(1949.98);
    checkout.reset();
  });
});
