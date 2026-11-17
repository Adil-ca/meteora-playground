import { binPrice } from '@/lib/market';
import type { GameState } from '@/lib/game';
export function BinBoard({
  state,
  remove,
  onAllocate,
}: {
  state: GameState;
  remove: boolean;
  onAllocate: (index: number) => void;
}) {
  const disabled = state.phase === 'paused' || state.phase === 'over';
  return (
    <div
      className="bin-board"
      role="group"
      aria-label="Liquidity price bins. Arrow keys move focus; Enter or Space allocates."
    >
      {state.bins.map((chips, i) => (
        <button
          key={i}
          disabled={disabled}
          className={`bin ${i === state.price ? 'active-bin' : ''} ${chips ? 'allocated' : ''}`}
          onClick={() => onAllocate(i)}
          aria-label={`Bin ${i + 1}, price ${binPrice(i)}, ${chips} chips${i === state.price ? ', active price' : ''}. ${remove ? 'Remove' : 'Add'} liquidity`}
          onKeyDown={(e) => {
            if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
              e.preventDefault();
              const buttons = e.currentTarget.parentElement?.querySelectorAll('button');
              const step =
                e.key === 'ArrowRight'
                  ? 1
                  : e.key === 'ArrowLeft'
                    ? -1
                    : e.key === 'ArrowDown'
                      ? 8
                      : -8;
              buttons?.[(i + step + state.bins.length) % state.bins.length]?.focus();
            }
          }}
        >
          <span className="bin-active-marker">{i === state.price ? '▼' : '·'}</span>
          <span className="bin-number">{String(i + 1).padStart(2, '0')}</span>
          <span className="chip-stack">
            {[2, 1, 0].map((level) => (
              <span key={level} className={chips > level ? 'filled' : ''} />
            ))}
          </span>
          <span className="bin-price">{binPrice(i)}</span>
          <span className="bin-chip-label">
            {chips ? `${chips} ${chips === 1 ? 'chip' : 'chips'}` : '+'}
          </span>
        </button>
      ))}
    </div>
  );
}
