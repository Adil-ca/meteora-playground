import { Info } from 'lucide-react';
export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`disclaimer ${compact ? 'compact' : ''}`}>
      <Info size={15} />
      <p>
        {compact
          ? 'Educational simulation. Virtual liquidity and game points only. No real funds or transactions.'
          : 'Built for curiosity, not investment decisions. Independent community project, not affiliated with or endorsed by Meteora. All prices, activity, allocations and scores are illustrative. These simulations do not reproduce on-chain execution, token inventory changes, real fees, returns or risk.'}
      </p>
    </div>
  );
}
