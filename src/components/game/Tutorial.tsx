import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
const steps = [
  {
    title: 'Meet your price bins.',
    text: 'Each column is one price. The coral marker shows the active price bin. Your mission: have liquidity there when activity arrives.',
    visual: '01 — FIND THE CORAL MARKER',
  },
  {
    title: 'Place your chips.',
    text: 'Tap a bin to add a virtual chip, up to three. Tap a full bin to reclaim all three, or use Remove to take one back. Start with a few bins near the active price.',
    visual: '02 — TAP TO BUILD YOUR RANGE',
  },
  {
    title: 'Follow the action.',
    text: 'You have 60 seconds. The market shifts from sideways to trending to volatile. Keep adapting. Covered activity earns points; uncovered activity costs points.',
    visual: '03 — PLACE. ADAPT. REPEAT.',
  },
];
export function Tutorial({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  const current = steps[step];
  return (
    <dialog
      ref={ref}
      className="tutorial-dialog"
      onCancel={onClose}
      aria-labelledby="tutorial-title"
    >
      <button className="icon-button dialog-close" onClick={onClose} aria-label="Close tutorial">
        <X size={20} />
      </button>
      <div className="eyebrow">A 15-SECOND FIELD GUIDE</div>
      <div className="tutorial-art" aria-hidden="true">
        {[1, 2, 3, 2, 1].map((n, i) => (
          <div key={i} className={i === 2 ? 'current' : ''}>
            {Array.from({ length: n }, (_, j) => (
              <span key={j} />
            ))}
          </div>
        ))}
        <b>▼</b>
      </div>
      <span className="mono tutorial-caption">{current.visual}</span>
      <h2 id="tutorial-title">{current.title}</h2>
      <p>{current.text}</p>
      <div className="tutorial-footer">
        <div className="step-dots">
          {steps.map((_, i) => (
            <button
              key={i}
              aria-label={`Tutorial step ${i + 1}`}
              aria-current={i === step ? 'step' : undefined}
              onClick={() => setStep(i)}
              className={i === step ? 'selected' : ''}
            />
          ))}
        </div>
        <button
          className="button primary"
          onClick={() => (step === 2 ? onClose() : setStep(step + 1))}
        >
          {step === 2 ? 'Let’s play' : 'Next'}{' '}
          {step === 2 ? <Check size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
      <p className="micro">Game rules are simplified. Points are not real fees or returns.</p>
    </dialog>
  );
}
