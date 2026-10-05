import React from 'react';
import { Heart, Sparkles, Shield } from 'lucide-react';
import { TradingCardProps } from './types';

/**
 * Calculates WCAG photometric relative luminance (0 to 1).
 */
function getRelativeLuminance(colorHex?: string): number {
  if (!colorHex || typeof colorHex !== 'string') return 0;
  let hex = colorHex.replace('#', '').trim();
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  if (hex.length !== 6) return 0;
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  if (isNaN(r) || isNaN(g) || isNaN(b)) return 0;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculates contrast ratio between two hex colors.
 */
function getContrast(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function lightenHex(hex: string, amount: number = 0.55): string {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
  if (clean.length !== 6) return '#f1f5f9';
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#f1f5f9';
  const newR = Math.min(255, Math.round(r + (255 - r) * amount));
  const newG = Math.min(255, Math.round(g + (255 - g) * amount));
  const newB = Math.min(255, Math.round(b + (255 - b) * amount));
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

function darkenHex(hex: string, amount: number = 0.55): string {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
  if (clean.length !== 6) return '#0f172a';
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#0f172a';
  const newR = Math.max(0, Math.round(r * (1 - amount)));
  const newG = Math.max(0, Math.round(g * (1 - amount)));
  const newB = Math.max(0, Math.round(b * (1 - amount)));
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Ensures text colored with an accent hex is clearly readable against the background.
 * If contrast is below the human readability threshold (< 3.2:1), shifts or falls back to a legible tone.
 */
function getReadableAccent(accentHex: string, bgHex: string, isDarkBg: boolean): string {
  const contrast = getContrast(accentHex, bgHex);
  if (contrast >= 3.2) {
    return accentHex;
  }
  if (isDarkBg) {
    const lightened = lightenHex(accentHex, 0.6);
    if (getContrast(lightened, bgHex) >= 3.5) {
      return lightened;
    }
    return '#f1f5f9';
  } else {
    const darkened = darkenHex(accentHex, 0.6);
    if (getContrast(darkened, bgHex) >= 3.5) {
      return darkened;
    }
    return '#0f172a';
  }
}

export function TradingCard({
  id = 'trading-card',
  name = '',
  emoji = '',
  hp = 0,
  stageBadge,
  evolutionNote,
  cardNumber,
  elementEmoji,
  colorStart = '#3b82f6',
  colorEnd = '#1d4ed8',
  cardColor = '#0c0a09',
  showGrid = true,
  showCornerBrackets = true,
  showCombatMatrix = true,
  ability,
  attacks = [],
  combatMatrix,
  className = '',
  style: userStyle,
}: TradingCardProps) {
  const visibleAttacks = (attacks || []).slice(0, 2);

  // Photometric luminance determines whether body text is white or dark
  const luminance = getRelativeLuminance(cardColor);
  const useWhiteText = luminance < 0.36;

  // Ensure colored text (stage badge, card number, ability name, damage) is clearly legible against card background
  const legibleColorStart = getReadableAccent(colorStart, cardColor, useWhiteText);
  const legibleColorEnd = getReadableAccent(colorEnd, cardColor, useWhiteText);

  const hasCombatMatrix = Boolean(showCombatMatrix && combatMatrix);

  return (
    <article
      id={id}
      className={`relative w-[360px] sm:w-[380px] h-[580px] sm:h-[600px] rounded-3xl p-3 sm:p-3.5 transition-all duration-200 select-none flex flex-col shrink-0 overflow-hidden isolate box-border ${className}`}
      style={{
        fontFamily: "'Outfit', sans-serif",
        boxSizing: 'border-box',
        background: `linear-gradient(to bottom, ${colorStart}, ${colorEnd})`,
        boxShadow: '0 12px 32px -8px rgba(0, 0, 0, 0.35)',
        border: 'none',
        outline: 'none',
        ...userStyle,
      }}
    >
      {/* Inner Card Card-Stock Canvas with configurable cardColor */}
      <div
        id="card-inner-surface"
        className={`relative w-full h-full rounded-[20px] overflow-hidden flex flex-col justify-between pb-2.5 shrink-0 transition-colors duration-200 ${
          useWhiteText ? 'text-white' : 'text-stone-900'
        }`}
        style={{
          backgroundColor: cardColor,
          borderRadius: '20px',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Card Header: Type, Name, and Health */}
        <header
          id="card-header"
          className="relative z-10 px-3.5 pt-2.5 pb-2 shrink-0"
          style={{
            flex: '0 0 auto',
            borderBottom: useWhiteText ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Stage badge row */}
          <div className="flex items-center justify-between gap-2 text-[10px] font-bold tracking-wider uppercase mb-1 overflow-hidden">
            <span
              className="flex items-center gap-1 font-bold shrink-0"
              style={{ color: legibleColorStart }}
            >
              <Sparkles className="w-3 h-3 shrink-0" style={{ color: legibleColorStart }} />
              <span className="truncate">{stageBadge || 'Basic'}</span>
            </span>
            {evolutionNote && (
              <span
                className={`text-[10px] tracking-normal font-medium truncate text-right ${
                  useWhiteText ? 'text-white/70' : 'text-stone-500'
                }`}
              >
                {evolutionNote}
              </span>
            )}
          </div>

          {/* Main Title Row: Character Name & HP Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <h1
                id="character-name"
                className={`text-2xl font-black tracking-wide truncate ${
                  useWhiteText ? 'text-white' : 'text-stone-900'
                }`}
              >
                {name || 'Unnamed Card'}
              </h1>
            </div>

            {/* Health Points (HP) badge - Protected Signature Ruby Red Pill */}
            <div
              id="character-health"
              className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 shrink-0 transition-colors duration-200 bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs"
              style={{
                flex: '0 0 auto',
                border: '1px solid rgba(248, 113, 113, 0.8)',
              }}
            >
              <Heart className="w-3.5 h-3.5 shrink-0 text-red-100 fill-red-100" />
              <span className="text-xs font-bold tracking-tight text-red-100">
                HP <strong className="text-sm font-extrabold text-white">{hp ?? 0}</strong>
              </span>
              <span
                title="Element"
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 bg-black/25 text-white leading-none shadow-xs"
                style={{ border: '1px solid rgba(255, 255, 255, 0.35)' }}
              >
                {elementEmoji || '✨'}
              </span>
            </div>
          </div>
        </header>

        {/* Character Illustration Frame - Strictly blocked dimensions & aspect ratio */}
        <section
          id="card-portrait-area"
          className="relative z-10 px-3 pt-2 pb-1 shrink-0 w-full"
          style={{ flex: '0 0 auto' }}
        >
          <div
            id="portrait-frame"
            className={`relative w-full rounded-xl overflow-hidden border-2 flex items-center justify-center shrink-0 ${
              useWhiteText ? 'bg-white/[0.03]' : 'bg-black/[0.02]'
            }`}
            style={{
              borderColor: colorStart,
              height: '160px',
              minHeight: '160px',
              maxHeight: '160px',
              flex: '0 0 160px',
            }}
          >
            {/* Edge-to-Edge Blueprint Grid & Corner Brackets */}
            {(showGrid || showCornerBrackets) && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 320 160"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Full-bleed Edge-to-Edge Grid expanding across the entire frame */}
                {showGrid && (
                  <path
                    d="M 0 0 L 0 160 M 16 0 L 16 160 M 32 0 L 32 160 M 48 0 L 48 160 M 64 0 L 64 160 M 80 0 L 80 160 M 96 0 L 96 160 M 112 0 L 112 160 M 128 0 L 128 160 M 144 0 L 144 160 M 160 0 L 160 160 M 176 0 L 176 160 M 192 0 L 192 160 M 208 0 L 208 160 M 224 0 L 224 160 M 240 0 L 240 160 M 256 0 L 256 160 M 272 0 L 272 160 M 288 0 L 288 160 M 304 0 L 304 160 M 320 0 L 320 160 M 0 0 L 320 0 M 0 16 L 320 16 M 0 32 L 320 32 M 0 48 L 320 48 M 0 64 L 320 64 M 0 80 L 320 80 M 0 96 L 320 96 M 0 112 L 320 112 M 0 128 L 320 128 M 0 144 L 320 144 M 0 160 L 320 160"
                    fill="none"
                    stroke={colorStart}
                    strokeWidth="1"
                    strokeOpacity={useWhiteText ? '0.22' : '0.18'}
                    vectorEffect="non-scaling-stroke"
                  />
                )}
                {/* Corner brackets - Positioned precisely on grid intersections at (16, 16), (304, 16), (16, 144), (304, 144) */}
                {showCornerBrackets && (
                  <path
                    d="M 16 30 L 16 16 L 30 16 M 290 16 L 304 16 L 304 30 M 16 130 L 16 144 L 30 144 M 290 144 L 304 144 L 304 130"
                    fill="none"
                    stroke={colorStart}
                    strokeWidth="2.5"
                    strokeLinecap="square"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>
            )}

            {/* Ambient inner halo with gradient */}
            <div
              className="absolute w-36 h-36 rounded-full blur-xl pointer-events-none"
              style={{ background: `radial-gradient(circle, ${colorStart}40, transparent 70%)` }}
            />

            {/* Character Emoji */}
            <div
              id="character-emoji"
              role="img"
              aria-label={`${name} character`}
              className="relative z-10 text-6xl sm:text-7xl select-none shrink-0"
            >
              {emoji || '❓'}
            </div>
          </div>

          {/* Spec / Number banner */}
          {cardNumber && (
            <div
              id="character-specs"
              className={`mt-1.5 text-center text-[10px] font-semibold tracking-widest uppercase py-0.5 px-2 rounded-md shrink-0 ${
                useWhiteText ? 'bg-white/[0.05]' : 'bg-black/[0.04]'
              }`}
              style={{
                color: legibleColorStart,
                border: `1px solid ${colorStart}33`,
              }}
            >
              {cardNumber}
            </div>
          )}
        </section>

        {/* Abilities & Attacks Section - Tightly grouped unit that shifts down when combat stats are hidden */}
        <section
          id="card-abilities"
          className={`relative z-10 flex-1 min-h-0 flex flex-col gap-2.5 px-3.5 ${
            hasCombatMatrix
              ? 'justify-start py-1'
              : 'justify-center py-2.5'
          }`}
        >
          {/* Passive Trait / Ability (if present) */}
          {ability && (
            <div
              id="ability-passive"
              className={`p-1.5 px-2 rounded-lg shrink-0 ${
                useWhiteText ? 'bg-white/[0.05]' : 'bg-black/[0.04]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded shrink-0"
                  style={{ backgroundColor: colorEnd, color: '#ffffff' }}
                >
                  Ability
                </span>
                <span
                  className="text-xs font-bold truncate"
                  style={{ color: legibleColorEnd }}
                >
                  {ability.name}
                </span>
              </div>
              <p
                className={`text-[11px] leading-tight ${
                  useWhiteText ? 'text-white/90' : 'text-stone-700'
                }`}
              >
                {ability.description}
              </p>
            </div>
          )}

          {/* Attacks list (Max 2 attacks) - Tight contiguous stack */}
          <div className="flex flex-col gap-2.5 min-h-0">
            {visibleAttacks.map((attack, index) => (
              <div
                key={index}
                id={`attack-${index}`}
                className={`flex flex-col gap-0.5 shrink-0 ${
                  index < visibleAttacks.length - 1 ? 'pb-2' : ''
                }`}
                style={
                  index < visibleAttacks.length - 1
                    ? {
                        borderBottom: useWhiteText
                          ? '1px solid rgba(255, 255, 255, 0.08)'
                          : '1px solid rgba(0, 0, 0, 0.06)',
                      }
                    : undefined
                }
              >
                {/* Attack Title Line: Cost + Name on left, Damage on right */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {attack.energyCost && attack.energyCost.length > 0 && (
                      <div className="flex gap-0.5 shrink-0">
                        {attack.energyCost.map((cost, cIdx) => (
                          <span key={cIdx} className="text-xs">
                            {cost}
                          </span>
                        ))}
                      </div>
                    )}
                    <span
                      className={`text-xs font-bold truncate ${
                        useWhiteText ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      {attack.name}
                    </span>
                  </div>

                  {(attack.damage !== '' && attack.damage !== undefined) && (
                    <span
                      className="text-base font-black text-right shrink-0 pl-1"
                      style={{ color: legibleColorEnd }}
                    >
                      {attack.damage}
                    </span>
                  )}
                </div>

                {/* Attack Description */}
                {attack.description && (
                  <p
                    className={`text-[11px] leading-snug break-words ${
                      useWhiteText ? 'text-white/90' : 'text-stone-700'
                    }`}
                  >
                    {attack.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Combat Matrix (Weakness, Resistance, Retreat) */}
        {showCombatMatrix !== false && combatMatrix && (
          <section
            id="card-combat-matrix"
            className={`relative z-10 mx-3 mt-auto mb-1 px-2.5 py-1.5 rounded-lg text-[10px] grid grid-cols-3 text-center shrink-0 ${
              useWhiteText
                ? 'bg-white/[0.05]'
                : 'bg-black/[0.04]'
            }`}
          >
            <div>
              <span
                className={`block text-[9px] uppercase font-semibold ${
                  useWhiteText ? 'text-white/70' : 'text-stone-500'
                }`}
              >
                Weakness
              </span>
              <span
                className={`font-bold flex items-center justify-center gap-0.5 mt-0.5 ${
                  useWhiteText ? 'text-white' : 'text-stone-800'
                }`}
              >
                {combatMatrix.weakness?.element ? (
                  <>
                    <span>{combatMatrix.weakness.element}</span>
                    {combatMatrix.weakness.multiplier ? ` ${combatMatrix.weakness.multiplier}` : ''}
                  </>
                ) : (
                  <span className="text-stone-400 font-normal">—</span>
                )}
              </span>
            </div>
            <div>
              <span
                className={`block text-[9px] uppercase font-semibold ${
                  useWhiteText ? 'text-white/70' : 'text-stone-500'
                }`}
              >
                Resistance
              </span>
              <span
                className={`font-bold flex items-center justify-center gap-0.5 mt-0.5 ${
                  useWhiteText ? 'text-white' : 'text-stone-800'
                }`}
              >
                {combatMatrix.resistance?.element ? (
                  <>
                    <span>{combatMatrix.resistance.element}</span>
                    {combatMatrix.resistance.value ? ` ${combatMatrix.resistance.value}` : ''}
                  </>
                ) : (
                  <span className="text-stone-400 font-normal">—</span>
                )}
              </span>
            </div>
            <div>
              <span
                className={`block text-[9px] uppercase font-semibold ${
                  useWhiteText ? 'text-white/70' : 'text-stone-500'
                }`}
              >
                Retreat
              </span>
              <span
                className={`font-bold flex items-center justify-center gap-0.5 mt-0.5 ${
                  useWhiteText ? 'text-white' : 'text-stone-700'
                }`}
              >
                {combatMatrix.retreatCost === 0 ? (
                  <span className="text-stone-400 font-medium text-[9px] uppercase">Free</span>
                ) : (
                  <>
                    <Shield
                      className={`w-2.5 h-2.5 ${useWhiteText ? 'text-white/70' : 'text-stone-500'}`}
                    />{' '}
                    {combatMatrix.retreatCost ?? 0}
                  </>
                )}
              </span>
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

export default TradingCard;
