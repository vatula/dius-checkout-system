import {IPricingRule} from '../pricingRule';

export class FreeVGAForEachMBP implements IPricingRule {
  apply(items: Array<string>): Array<[string, number]> {
    let vgaCount = 0;
    const mbpCount = items.reduce((count, sku) => count + ((sku === 'mbp') ? 1 : 0), 0);
    return items.map((sku) => [sku, (sku === 'vga' && ((++vgaCount) <= mbpCount)) ? 0 : Number.MAX_SAFE_INTEGER] as [string, number]);
  }
}
