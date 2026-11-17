# Meteora research

Reviewed 17 November 2026. Official sources are the authority; this is a community educational project, not an endorsed application. Contest dates and rules were supplied by the project owner, not independently verified.

## Findings and implementation consequences

### DLMM

DLMM places liquidity in discrete price bins. A single bin is active at a time. Swaps within it use its fixed price; consuming available liquidity can move a swap through adjacent bins. “Zero slippage” is a within-bin statement, not a promise about an entire swap. A bin step defines neighboring price spacing. Selected liquidity outside the active bin is not currently supporting swaps at that price. Token composition changes as swaps traverse a position.

Spot distributes across the range; Curve emphasizes its middle; Bid-Ask emphasizes its edges. Concentration changes where capital is available, not a guaranteed outcome. Dynamic fees respond to volatility. The playground does not calculate these fees.

Sources:

- https://docs.meteora.ag/core-products/dlmm/what-is-dlmm
- https://github.com/MeteoraAg/dlmm-sdk
- https://raw.githubusercontent.com/MeteoraAg/dlmm-sdk/main/ts-client/README.md — confirms active-bin reads and Spot, Curve, BidAsk SDK strategies.

### DAMM v2

Configurable constant-product pools support a fixed concentrated range or full-range compounding model. Position NFTs represent LP ownership. Configuration includes fee behavior, activation, locks and rewards. This differs from choosing independent DLMM bin allocations. Do not describe DAMM v2 as only full range or confuse its current model with legacy DAMM v1 lending integrations.

Sources:

- https://docs.meteora.ag/core-products/damm-v2/what-is-damm-v2
- https://github.com/MeteoraAg/damm-v2-sdk
- https://raw.githubusercontent.com/MeteoraAg/damm-v2-sdk/main/README.md — confirms CpAmm and the SDK's pool/position operations.

### Dynamic Bonding Curve

DBC begins price discovery in a virtual pool with a configurable curve. A curve can have up to 16 segments. Each segment supplies a price boundary and virtual liquidity. Quote reserves reaching a configured threshold complete the curve; migration then creates DAMM liquidity. New configurations target DAMM v2; existing legacy DAMM v1-targeted pools retain that path. Completion and migration are distinct states, not a guarantee that an arbitrary launch instantly succeeds.

Sources:

- https://docs.meteora.ag/core-products/dbc/what-is-dbc
- https://docs.meteora.ag/core-products/dbc/universal-curve
- https://docs.meteora.ag/core-products/dbc/migration-and-liquidity
- https://github.com/MeteoraAg/dynamic-bonding-curve-sdk
- https://raw.githubusercontent.com/MeteoraAg/dynamic-bonding-curve-sdk/main/packages/dynamic-bonding-curve/README.md — cross-checks migration threshold and current target restrictions.

## Starting-point and asset review

- https://www.meteora.ag/ — official home, dynamically rendered.
- https://app.meteora.ag/ — official application; client-rendered, no readable content through research browser.
- https://app.meteora.ag/create — official pool creation entry; client-rendered.
- https://launch.meteora.ag/ — official launch guide; links to launch products and documentation.
- https://docs.meteora.ag/llms.txt — current documentation index used to find canonical pages.
- https://github.com/MeteoraAg — official repository organization.

No public market API is needed. No SDK, wallet, signer, RPC or live financial data is integrated. This eliminates API-key requirements and prevents fictional market data from appearing live.

## Deliberate simplifications

The 15-bin game board uses an illustrative 100-basis-point step around a normalized price of 100. Its seeded random walk is external to liquidity, unlike real swap-driven execution. Allocation chips remain unchanged while price moves; no token balances, inventory conversion, impermanent loss, transaction costs, execution, or real fees are calculated. Reallocation is instantaneous. Activity bursts, combos and missed-coverage penalties are invented game rules, never protocol claims. Range Lab compares normalized allocation and current-bin coverage only, not performance.

## Unverified / excluded

No authoritative brand font or comprehensive redistribution license was confirmed. We use original artwork and type choices; do not call our palette official brand specifications. No yield, profitability, guaranteed launch outcome or competition endorsement is asserted. Product links are educational exits, not personalized financial recommendations.
