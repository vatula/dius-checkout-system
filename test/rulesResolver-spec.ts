import {IPricingRule} from '../src/pricingRule';
import {DefaultPricingRule} from '../src/rules/default';
import {RulesResolver} from '../src/rulesResolver';

describe('RulesResolver', () => {
  const defaultPricesRule = new DefaultPricingRule(new Map([
      ['ipd', 549.99],
      ['mbp', 1399.99],
      ['atv', 109.5],
      ['vga', 30]
    ]));

  const zeroPricesRule = new DefaultPricingRule(new Map([
      ['ipd', 0],
      ['mbp', 0],
      ['atv', 0],
      ['vga', 0]
    ]));

  describe('apply', () => {
    it('should return prices for sku from the map', () => {
      const rulesResolver = new RulesResolver();
      rulesResolver.add(defaultPricesRule);
      expect(rulesResolver.apply(['ipd'])).toEqual([['ipd', 549.99]]);
      expect(rulesResolver.apply(['mbp'])).toEqual([['mbp', 1399.99]]);
      expect(rulesResolver.apply(['atv'])).toEqual([['atv', 109.5]]);
      expect(rulesResolver.apply(['vga'])).toEqual([['vga', 30]]);
      expect(rulesResolver.apply(['vga', 'ipd'])).toEqual([['vga', 30], ['ipd', 549.99]]);
    });

    it('in case of the price conflict on the sku choose the smaller price', () => {
      const rulesResolver = new RulesResolver();

      const defaultPricesRule2 = new DefaultPricingRule(new Map([
        ['ipd', 549.99],
        ['mbp', 1000],
        ['atv', 112],
        ['vga', 29]
      ]));

      rulesResolver.add(defaultPricesRule, defaultPricesRule2);

      expect(rulesResolver.apply(['ipd', 'mbp', 'atv', 'vga'])).toEqual([
        ['ipd', 549.99],
        ['mbp', 1000],
        ['atv', 109.5],
        ['vga', 29]
      ]);
    });

    it('should return free bundled items', () => {

      class FreeVGAIfIPD implements IPricingRule {
        apply(items: Array<string>): Array<[string, number]> {
          const result = items.map((sku) => [sku, Number.MAX_SAFE_INTEGER] as [string, number]);
          const mbpCount = items.reduce((count, sku) => count + ((sku === 'ipd') ? 1 : 0), 0);
          const addVGA = new Array<[string, number]>(mbpCount).fill(['vga', 0]);
          return result.concat(addVGA);
        }
      }

      class FreeIPDIfIPD3 implements IPricingRule {
        apply(items: Array<string>): Array<[string, number]> {
          const result = items.map((sku) => [sku, Number.MAX_SAFE_INTEGER] as [string, number]);
          const ipdCount = items.reduce((count, sku) => count + ((sku === 'ipd') ? 1 : 0), 0);
          const addIPD = new Array<[string, number]>(Math.floor(ipdCount/3)).fill(['ipd', 0]);
          return result.concat(addIPD);
        }
      }

      const rulesResolver = new RulesResolver();
      const freeVGA = new FreeVGAIfIPD();
      const freeIPD = new FreeIPDIfIPD3();
      rulesResolver.add(defaultPricesRule, freeVGA, freeIPD);

      expect(rulesResolver.apply(['atv', 'ipd', 'mbp', 'ipd', 'vga', 'ipd', 'vga'])).toEqual([
        ['atv', 109.5],
        ['ipd', 549.99],
        ['mbp', 1399.99],
        ['ipd', 549.99],
        ['vga', 30],
        ['ipd', 549.99],
        ['vga', 30],
        ['vga', 0],
        ['vga', 0],
        ['vga', 0],
        ['ipd', 0]
      ]);

    });
  });

  describe('getPricelistMatrix', () => {
    class RulesResolverTest extends RulesResolver {
      public getPricelistMatrix(items: Array<string>): Array<[string, Array<number>]> {
        return super.getPricelistMatrix(items);
      }
    }

    it('should return empty matrix when no rules provided', () => {
      const rulesResolver = new RulesResolverTest();
      expect(rulesResolver.getPricelistMatrix(['ipd', 'vga'])).toEqual([]);
    });

    it('should normalize rules output in the form of a matrix', () => {
      const rulesResolver = new RulesResolverTest();
      rulesResolver.add(defaultPricesRule, zeroPricesRule, defaultPricesRule);
      expect(rulesResolver.getPricelistMatrix(['ipd', 'vga'])).toEqual([['ipd', [549.99, 0, 549.99]], ['vga', [30 ,0, 30]]]);
    });
  });

  describe('add', () => {
    it('should use rules provided in the constructor', () => {
      const rulesResolver = new RulesResolver(zeroPricesRule);
      expect(rulesResolver.apply(['ipd', 'vga'])).toEqual([['ipd', 0], ['vga', 0]]);
    });

    it('should use rules provided through add method', () => {
      const rulesResolver = new RulesResolver();
      rulesResolver.add(zeroPricesRule);
      expect(rulesResolver.apply(['ipd', 'vga'])).toEqual([['ipd', 0], ['vga', 0]]);
    });
  });
});
