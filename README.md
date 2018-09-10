# dius-checkout-system

run `npm i`

run `npm test`

## Assumptions

> we will bundle in a free VGA adapter free of charge with every MacBook Pro sold

Here I assume that if person does not have VGA adapter scanned, then VGA adapter will not be added to the cart.
And hence the special price is not applied.

Ultimately this does not change the total. But this trait is important to know nevertheless.

> As our Sales manager is quite indecisive, we want the pricing rules to be as flexible as possible as they can change in the future with little notice.

The rules system is a map from scanned SKUs to a new list of pairs (SKU, price).
The processing of the rule application is as follows. Suppose those are the default prices.

sku1: price1
sku2: price2
sku3: price3

the default prices are described as a pricing rule
rule1:
  if (sku == sku1) then (sku1, price1)
  if (sku == sku2) then (sku2, price2)
  if (sku == sku3) then (sku3, price3)

and assuming the other three rules added

rule2:
  if (sku == sku1) then (sku1, 0) else (sku, MAX_INTEGER)

rule3:
  if (sku == sku1) then (sku1, 10) else (sku, MAX_INTEGER)

rule4:
  if (sku == sku3) then (sku3, 0) else (sku, MAX_INTEGER)

let scanned items be:

sku1, sku2, sku3

Then the resulting matrix produced will be

| SKU  | rule1   | rule2   | rule3   | rule4  |
| ---- | ------- | ------- | ------- | ------ |
| sku1 | price1  | 0       | 10      | MAX    |
| sku2 | price2  | MAX     | MAX     | MAX    |
| sku3 | price3  | MAX     | MAX     | 0      |

The resolution will pick the smallest price for the SKU row.
The assumption made here is that all pricing rules are correct. But we pick the one that favours the customer in case of a conflict.

