export interface IPricingRule {
  apply(items: Array<string>): Array<[string, number]>;
}
