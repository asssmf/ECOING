import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Recycle, Trash2, Leaf, Play, RotateCcw, X, Briefcase, 
  Clock, DollarSign, AlertTriangle, Clover, Zap, ShoppingBag, 
  Skull, Trash, Star, Box, ShieldCheck, Pause, Volume2, 
  VolumeX, Radiation, Crosshair, Settings, BookOpen, PenTool,
  ChevronsUp, Moon, Sun, Terminal, Unlock, Eye, Activity,
  ZapOff, Vibration, FastForward, Ghost, Anchor, Book, Info,
  Flame, Droplets, Atom, Wind, Target, FileText, Battery,
  Smartphone, Monitor, Sliders, Volume1, Layout, Gem, Snowflake,
  Home, LogOut, HelpCircle, Shield, TrendingUp, BarChart3, RefreshCw,
  Cloud, Droplet, Factory, CheckCircle, Cpu
} from 'lucide-react';

// --- VISUAL ASSETS & STYLES ---
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
  
  :root {
    --holo-cyan: #06b6d4;
    --holo-blue: #3b82f6;
    --holo-green: #10b981;
    --holo-red: #ef4444;
    --holo-purple: #d946ef;
    --holo-bg: #000000;
  }

  body, html, #root {
    background-color: #000000;
    color: white;
    overflow: hidden;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Rajdhani', sans-serif;
    touch-action: none;
  }

  .font-mono {
    font-family: 'Share Tech Mono', monospace;
  }

  /* --- HOLOGRAPHIC & CRT EFFECTS --- */

  .crt-scanlines {
    background: linear-gradient(
      to bottom,
      rgba(255,255,255,0),
      rgba(255,255,255,0) 50%,
      rgba(0,0,0,0.3) 50%,
      rgba(0,0,0,0.3)
    );
    background-size: 100% 4px;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none; /* CRITICAL: Allows clicks to pass through */
    z-index: 9999;
    animation: scanline 0.2s linear infinite;
    mix-blend-mode: overlay;
  }

  .holo-overlay {
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(6, 182, 212, 0.05) 4px
    );
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }

  /* FULL OPAQUE BACKGROUND FOR MENUS */
  .menu-bg {
    background-color: #020617;
    background-image: 
      radial-gradient(circle at center, #1e293b 0%, #000000 100%),
      linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
    position: absolute;
    inset: 0;
    z-index: 80;
    width: 100%;
    height: 100%;
  }

  .holo-panel {
    background: rgba(8, 12, 20, 0.95);
    border: 1px solid rgba(6, 182, 212, 0.4);
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.15), inset 0 0 30px rgba(6, 182, 212, 0.05);
    backdrop-filter: blur(12px);
    position: relative;
    border-radius: 8px;
    z-index: 50;
  }

  .holo-panel::before {
    content: ''; position: absolute; top: -1px; left: -1px; width: 8px; height: 8px;
    border-top: 2px solid var(--holo-cyan); border-left: 2px solid var(--holo-cyan);
    pointer-events: none;
  }
  .holo-panel::after {
    content: ''; position: absolute; bottom: -1px; right: -1px; width: 8px; height: 8px;
    border-bottom: 2px solid var(--holo-cyan); border-right: 2px solid var(--holo-cyan);
    pointer-events: none;
  }

  .holo-btn {
    background: linear-gradient(180deg, rgba(6,182,212,0.1) 0%, rgba(6,182,212,0.05) 100%);
    border: 1px solid rgba(6, 182, 212, 0.5);
    color: #bae6fd;
    text-shadow: 0 0 5px rgba(6, 182, 212, 0.6);
    transition: all 0.1s ease;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    z-index: 51;
  }
  
  .holo-btn:hover:not(:disabled) {
    background: rgba(6, 182, 212, 0.25);
    border-color: #22d3ee;
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
    transform: translateY(-2px);
  }
  
  .holo-btn:active:not(:disabled) { transform: scale(0.95); }
  .holo-btn:disabled { opacity: 0.4; filter: grayscale(1); cursor: not-allowed; }

  .holo-text-glow { text-shadow: 0 0 10px currentColor; }

  /* ITEM CARD DESIGN - CLASSIC ROUNDED */
  .item-card {
    background: rgba(13, 18, 30, 0.95);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-bottom-width: 4px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.6);
    border-radius: 12px;
    transition: transform 0.1s;
  }

  /* PURE CSS METHANE FLOW EFFECT */
  .fog-flow {
    background: radial-gradient(ellipse at center bottom, rgba(132, 204, 22, 0.4) 0%, rgba(132, 204, 22, 0.1) 50%, transparent 100%);
    animation: toxic-breathe 4s ease-in-out infinite alternate;
    mix-blend-mode: screen;
    pointer-events: none;
  }

  /* Removed "opacity" from keyframes so it strictly obeys 
    the inline style visibility toggle from the game engine 
  */
  @keyframes toxic-breathe {
    0% { transform: scaleY(1); filter: brightness(1); }
    100% { transform: scaleY(1.3); filter: brightness(1.3); }
  }

  .void-sink {
    background: linear-gradient(to bottom, transparent 0%, #000000 60%, #000000 100%);
    pointer-events: none;
    z-index: 20;
  }

  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.5); }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }

  @keyframes float-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
`;

// --- GLOBAL SETTINGS ---
if (typeof window !== 'undefined' && !window.ECO_SETTINGS) {
  window.ECO_SETTINGS = {
    masterVolume: 0.5,
    sfxVolume: 1.0,
    chaos: false,
    theme: 'light',
    shake: true,
    particles: true,
    ecoMode: false,
    leftHanded: false,
    crtOpacity: 0.4
  };
}

// --- GAME CONSTANTS ---
const STARTING_BANKRUPTCY_LIMIT = -200;
const BANKRUPTCY_INCREASE_PER_WAVE = 30; 
const BOSS_TIMER_DURATION = 90; 
const BASE_REWARD = 5; 
const STARTING_PENALTY = 10;
const BASE_SHIELD_PER_ITEM = 0.1;
const SHOP_REROLL_COST = 50;
const FLOOR_THRESHOLD = 95; 

// --- REGULATIONS DB ---
const REGULATIONS = {
  1: { title: "MUNICIPAL SORTING ACT", fact: "Did you know? 91% of plastic isn't recycled. Proper sorting is the first step to circular economy.", rule: "BASIC TRAINING: Sort items correctly to fund your facility. Missed items incur penalties.", mechanic: "standard" },
  2: { title: "ORGANIC FERMENTATION BAN", fact: "Food waste in landfills generates Methane (CH4), a greenhouse gas 25x more potent than CO2.", rule: "NEW HAZARD: Putting Compost in TRASH releases Methane. It blocks vision and speeds up falling items.", mechanic: "methane" },
  3: { title: "E-WASTE DIRECTIVE", fact: "Electronics contain lead and mercury. One battery can contaminate thousands of liters of groundwater.", rule: "HEAVY METAL LEAK: Missed E-Waste leaks Acid (Shield Dmg) and gives you a TOXIC VIAL.", mechanic: "acid_leak" },
  4: { title: "POLYMER RIGIDITY LAW", fact: "Rigid plastics (HDPE) take 450+ years to decompose. They occupy huge volume in landfills.", rule: "CRUSH REQUIRED: 'Rigid Plastic' items will appear. You must TAP THEM TWICE to crush them before selecting.", mechanic: "rigid_plastic" },
  5: { title: "CARBON EMISSIONS CAP", fact: "Every ton of trash incinerated releases tons of CO2. The city has installed emission sensors.", rule: "CARBON TAX: Using TRASH fills the CO2 Meter. Recycling lowers it. If >85%, funds are taxed continuously.", mechanic: "carbon_tax" },
  6: { title: "CONTAMINATION PROTOCOL", fact: "One greasy pizza box can ruin an entire batch of paper recycling ('Wish-cycling').", rule: "DIRTY ITEMS: 'Contaminated' items (Green Slime) must be TRASHED. Wrong bin = 50% FUND DEDUCTION.", mechanic: "contamination" },
  7: { title: "EMERGENCY: THE CLOG", fact: "Plastic waste accumulation in drainage systems causes massive urban flooding during monsoons.", rule: "FINAL BOSS: The water level is rising. Trash hits raise the water. Sort correctly to clear the blockage!", mechanic: "flood" }
};

// --- AUDIO ENGINE ---
const playSound = (type) => {
  if (typeof window === 'undefined' || window.ECO_SETTINGS.masterVolume <= 0) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!window.ecoAudioCtx) window.ecoAudioCtx = new AudioContext();
    const ctx = window.ecoAudioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const vol = window.ECO_SETTINGS.masterVolume * window.ECO_SETTINGS.sfxVolume;
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'click') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); gainNode.gain.setValueAtTime(0.05 * vol, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(now); osc.stop(now + 0.1); } 
    else if (type === 'select') { osc.type = 'triangle'; osc.frequency.setValueAtTime(400, now); osc.frequency.linearRampToValueAtTime(600, now + 0.1); gainNode.gain.setValueAtTime(0.1 * vol, now); gainNode.gain.linearRampToValueAtTime(0, now + 0.1); osc.start(now); osc.stop(now + 0.1); }
    else if (type === 'crack') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); osc.frequency.linearRampToValueAtTime(50, now + 0.05); gainNode.gain.setValueAtTime(0.2 * vol, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(now); osc.stop(now + 0.1); }
    else if (type === 'success') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1); gainNode.gain.setValueAtTime(0.4 * vol, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3); osc.start(now); osc.stop(now + 0.3); }
    else if (type === 'hit') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); gainNode.gain.setValueAtTime(0.1 * vol, now); gainNode.gain.linearRampToValueAtTime(0, now + 0.2); osc.start(now); osc.stop(now + 0.2); }
    else if (type === 'shieldHit') { osc.type = 'square'; osc.frequency.setValueAtTime(400, now); gainNode.gain.setValueAtTime(0.1 * vol, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1); }
    else if (type === 'splash') { osc.type = 'triangle'; osc.frequency.setValueAtTime(300, now); osc.frequency.linearRampToValueAtTime(100, now + 0.3); gainNode.gain.setValueAtTime(0.2 * vol, now); gainNode.gain.linearRampToValueAtTime(0, now + 0.3); osc.start(now); osc.stop(now + 0.3); }
    else if (type === 'attack') { osc.type = 'square'; osc.frequency.setValueAtTime(200, now); gainNode.gain.setValueAtTime(0.1 * vol, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(now); osc.stop(now + 0.1); }
    else if (type === 'buy') { osc.type = 'sine'; osc.frequency.setValueAtTime(1200, now); gainNode.gain.setValueAtTime(0.1 * vol, now); gainNode.gain.linearRampToValueAtTime(0, now + 0.4); osc.start(now); osc.stop(now + 0.4); }
    else if (type === 'alarm') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(600, now); osc.frequency.linearRampToValueAtTime(400, now + 0.5); gainNode.gain.setValueAtTime(0.1 * vol, now); gainNode.gain.linearRampToValueAtTime(0, now + 1.2); osc.start(now); osc.stop(now + 1.2); }
    else if (type === 'explode') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); gainNode.gain.setValueAtTime(0.3 * vol, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.0); osc.start(now); osc.stop(now + 1.0); }
    else if (type === 'pop') { osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now); gainNode.gain.setValueAtTime(0.9 * vol, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(now); osc.stop(now + 0.1); }
  } catch (e) {}
};

// --- DATA DEFINITIONS ---
const CAT_RECYCLE = 'recycle';
const CAT_COMPOST = 'compost';
const CAT_TRASH = 'trash';

const RARITY = {
  common: { color: 'bg-slate-200', text: 'text-slate-600', val: 0.1, border: 'border-slate-300', labelKey: 'common', label: 'Common' },
  uncommon: { color: 'bg-emerald-100', text: 'text-emerald-600', val: 0.5, border: 'border-emerald-300', labelKey: 'uncommon', label: 'Uncommon' },
  rare: { color: 'bg-blue-100', text: 'text-blue-600', val: 1.5, border: 'border-blue-300', labelKey: 'rare', label: 'Rare' },
  epic: { color: 'bg-purple-100', text: 'text-purple-600', val: 5.0, border: 'border-purple-300', labelKey: 'epic', label: 'Epic' },
  legendary: { color: 'bg-yellow-100', text: 'text-yellow-600', val: 15.0, border: 'border-yellow-400', labelKey: 'legendary', label: 'Legendary' },
  lunar: { color: 'bg-slate-900', text: 'text-purple-300', val: 50.0, border: 'border-purple-500', labelKey: 'lunar', label: 'Lunar' },
  toxic: { color: 'bg-lime-100', text: 'text-lime-700', val: -3.0, border: 'border-lime-500', labelKey: 'toxic', label: 'TOXIC' },
  hazard: { color: 'bg-red-900', text: 'text-red-500', val: 0, border: 'border-red-600', label: 'HAZARD', labelKey: 'hazard' },
};

const safeRarity = (rarityKey) => RARITY[rarityKey] || RARITY.common;

const WASTE_DB = [
  { id: 'bottle', name: 'Plastic Bottle', icon: '🥤', cat: CAT_RECYCLE, rarity: 'common' },
  { id: 'paper', name: 'Newspaper', icon: '📰', cat: CAT_RECYCLE, rarity: 'common' },
  { id: 'apple', name: 'Apple Core', icon: '🍎', cat: CAT_COMPOST, rarity: 'common' },
  { id: 'wrapper', name: 'Candy Wrapper', icon: '🍬', cat: CAT_TRASH, rarity: 'common' },
  { id: 'shoe', name: 'Old Shoe', icon: '👟', cat: CAT_TRASH, rarity: 'common' },
  { id: 'egg', name: 'Egg Shell', icon: '🥚', cat: CAT_COMPOST, rarity: 'common' },
  { id: 'rag', name: 'Dirty Rag', icon: '🧣', cat: CAT_TRASH, rarity: 'common' },
  { id: 'can', name: 'Aluminum Can', icon: '🥫', cat: CAT_RECYCLE, rarity: 'uncommon' },
  { id: 'banana', name: 'Banana Peel', icon: '🍌', cat: CAT_COMPOST, rarity: 'uncommon' },
  { id: 'foam', name: 'Styrofoam', icon: '☁️', cat: CAT_TRASH, rarity: 'uncommon' },
  { id: 'carton', name: 'Milk Carton', icon: '🥛', cat: CAT_RECYCLE, rarity: 'uncommon' },
  { id: 'spray', name: 'Spray Paint', icon: '🎨', cat: CAT_TRASH, rarity: 'uncommon' },
  { id: 'toy', name: 'Broken Toy', icon: '🧸', cat: CAT_TRASH, rarity: 'uncommon' },
  { id: 'glass', name: 'Wine Bottle', icon: '🍾', cat: CAT_RECYCLE, rarity: 'rare' },
  { id: 'bones', name: 'Fish Bones', icon: '🐟', cat: CAT_COMPOST, rarity: 'rare' },
  { id: 'battery', name: 'Old Battery', icon: '🔋', cat: CAT_TRASH, rarity: 'rare' },
  { id: 'pizza', name: 'Pizza Box', icon: '🍕', cat: CAT_COMPOST, rarity: 'rare' },
  { id: 'smartwatch', name: 'Smart Watch', icon: '⌚', cat: CAT_RECYCLE, rarity: 'rare' },
  { id: 'laptop', name: 'Old Laptop', icon: '💻', cat: CAT_RECYCLE, rarity: 'epic' },
  { id: 'steak', name: 'Aged Steak', icon: '🥩', cat: CAT_COMPOST, rarity: 'epic' },
  { id: 'toxin', name: 'Chem. Sludge', icon: '🧪', cat: CAT_TRASH, rarity: 'epic' },
  { id: 'fossil', name: 'Fossil', icon: '🦕', cat: CAT_COMPOST, rarity: 'epic' },
  { id: 'goldbar', name: 'Gold Bar', icon: '🪙', cat: CAT_RECYCLE, rarity: 'legendary' },
  { id: 'meteor', name: 'Meteorite', icon: '☄️', cat: CAT_TRASH, rarity: 'legendary' },
  { id: 'ring', name: 'Diamond Ring', icon: '💍', cat: CAT_RECYCLE, rarity: 'legendary' },
  { id: 'junk', name: 'Space Junk', icon: '🛰️', cat: CAT_TRASH, rarity: 'lunar' },
];

const PERK_DB = [
  { id: 'hands', name: 'Faster Hands', icon: '🧤', cat: CAT_RECYCLE, rarity: 'common', price: 100, perk: '-5% fall speed', type: 'speed', val: -0.05 },
  { id: 'gloves', name: 'Safety Gloves', icon: '🛡️', cat: CAT_TRASH, rarity: 'common', price: 100, perk: '-$3 penalty', type: 'flatShield', val: 3 },
  { id: 'training', name: 'Value Training', icon: '📚', cat: CAT_COMPOST, rarity: 'common', price: 100, perk: '+5% base reward', type: 'baseReward', val: 0.05 },
  { id: 'storage', name: 'Storage Upgrade', icon: '📦', cat: CAT_TRASH, rarity: 'common', price: 100, perk: '+5% bonus cash', type: 'stackBonus', val: 0.05 },
  { id: 'subsidy', name: 'Recycling Subsidy', icon: '♻️', cat: CAT_RECYCLE, rarity: 'uncommon', price: 250, perk: '+10% Recycle val', type: 'catMod', target: CAT_RECYCLE, val: 0.1 },
  { id: 'grant', name: 'Compost Grant', icon: '🍂', cat: CAT_COMPOST, rarity: 'uncommon', price: 250, perk: '+10% Compost val', type: 'catMod', target: CAT_COMPOST, val: 0.1 },
  { id: 'tax', name: 'Waste Tax Credit', icon: '🗑️', cat: CAT_TRASH, rarity: 'uncommon', price: 250, perk: '+10% Trash val', type: 'catMod', target: CAT_TRASH, val: 0.1 },
  { id: 'combo', name: 'Combo Discipline', icon: '🥋', cat: CAT_RECYCLE, rarity: 'uncommon', price: 250, perk: '+5% Cash Flow', type: 'globalCash', val: 0.05 },
  { id: 'analyst', name: 'Market Analyst', icon: '📈', cat: CAT_RECYCLE, rarity: 'rare', price: 600, perk: '+5% Luck', type: 'luck', val: 0.05 },
  { id: 'insurance', name: 'Insurance Layer', icon: '☂️', cat: CAT_TRASH, rarity: 'rare', price: 600, perk: '+1 Shield Block', type: 'flatShield', val: 1 },
  { id: 'pressure', name: 'Boss Pressure', icon: '👺', cat: CAT_COMPOST, rarity: 'rare', price: 600, perk: '+10 Flat Boss Dmg', type: 'bossDmg', val: 10 },
  { id: 'greed', name: 'Greed Protocol', icon: '💰', cat: CAT_TRASH, rarity: 'rare', price: 600, perk: '+10% Cash, +10% higher Penalties', type: 'risk', val: 0.1 },
  { id: 'mirror', name: 'Broken Mirror', icon: '🪞', cat: CAT_TRASH, rarity: 'rare', price: 600, perk: '+20% Luck, -10% Cash', type: 'tradeLuck', val: 0.2 },
  { id: 'infra', name: 'Golden Infra.', icon: '🏗️', cat: CAT_RECYCLE, rarity: 'legendary', price: 1500, perk: '+15% Global Cash', type: 'globalCash', val: 0.15 },
  { id: 'efficiency', name: 'Supreme Eff.', icon: '⚡', cat: CAT_COMPOST, rarity: 'legendary', price: 1500, perk: '+10% Stack Speed', type: 'stackBonus', val: 0.1 },
  { id: 'precision', name: 'Precision Doc.', icon: '🎯', cat: CAT_RECYCLE, rarity: 'legendary', price: 1500, perk: '+5% Crit Chance', type: 'crit', val: 0.05 },
  { id: 'titan', name: 'Titan Contract', icon: '📜', cat: CAT_TRASH, rarity: 'legendary', price: 1500, perk: '+20 Flat Boss Dmg', type: 'bossDmg', val: 20 },
  { id: 'bailout', name: 'Corp. Bailout', icon: '🏦', cat: CAT_COMPOST, rarity: 'legendary', price: 1500, perk: 'Bankrupt Limit -100', type: 'bailout', val: 100 },
  { id: 'magnet', name: 'Magnetic Gloves', icon: '🧲', cat: CAT_RECYCLE, rarity: 'legendary', price: 1500, perk: 'Hitbox +20%', type: 'hitbox', val: 0.2 },
  { id: 'blood', name: 'Blood Market', icon: '🩸', cat: CAT_TRASH, rarity: 'lunar', price: 3000, perk: '+40% Cash, +40% Penalty', type: 'blood', val: 0.4 },
  { id: 'time', name: 'Time Collapse', icon: '⏳', cat: CAT_RECYCLE, rarity: 'lunar', price: 3000, perk: '-20% Fall Speed, +30% Spawn Rate', type: 'chaos', val: 0.2 },
  { id: 'awakening', name: 'Boss Awakening', icon: '👁️', cat: CAT_COMPOST, rarity: 'lunar', price: 3000, perk: 'Boss Reward x2, Boss HP +50%', type: 'bossRisk', val: 1 },
  { id: 'fragile', name: 'Fragile Wealth', icon: '💎', cat: CAT_RECYCLE, rarity: 'lunar', price: 3000, perk: 'Cash x2, Shields Disabled', type: 'glassCannon', val: 1 },
  { id: 'corrupt', name: 'Corrupted Luck', icon: '🎲', cat: CAT_TRASH, rarity: 'lunar', price: 3000, perk: '+30% Luck, Commons Worth 0', type: 'corruptLuck', val: 0.3 },
  { id: 'collapse', name: 'Market Collapse', icon: '📉', cat: CAT_TRASH, rarity: 'lunar', price: 3000, perk: '30% Chance: 3x Profit OR -4x Loss', type: 'collapse', val: 1 },
  { id: 'void', name: 'Void Prism', icon: '🔻', cat: CAT_COMPOST, rarity: 'lunar', price: 3000, perk: 'Stack Value x2, Global Cash -15%', type: 'void', val: 1 },
];

const HAZARD_ITEM = { id: 'hazard', name: 'TOXIC WASTE', icon: '☢️', cat: 'hazard', rarity: 'hazard' };
const ACID_ITEM = { id: 'acid_vial', name: 'Acid Vial', icon: '🧪', cat: CAT_TRASH, rarity: 'toxic', perk: '-3% Cash, -1 Boss Dmg (DELETE TO CURE)', type: 'corrosive', val: 0.03 };

const BOSS_ITEMS = [
  { id: 'boss_slime', name: 'Toxic Slime', icon: '🤮', cat: CAT_TRASH, rarity: 'common' },
  { id: 'boss_scrap', name: 'Mega Scrap', icon: '⚙️', cat: CAT_RECYCLE, rarity: 'common' },
  { id: 'boss_rot', name: 'Rotten Log', icon: '🪵', cat: CAT_COMPOST, rarity: 'common' },
];

const PERK_DESCRIPTIONS = {
    hands: "Reduces falling speed of all items by 5%.",
    gloves: "Reduces the penalty for missing/wrong items by $3.",
    training: "Increases the base value of all items by 5%.",
    storage: "Increases the value bonus from owning duplicates by 5%.",
    subsidy: "Increases the value of all Recycle items by 10%.",
    grant: "Increases the value of all Compost items by 10%.",
    tax: "Increases the value of all Trash items by 10%.",
    combo: "Multiplies total cash flow by 1.05x.",
    analyst: "Increases Luck by 5%.",
    insurance: "Blocks 1 penalty dollar. Works like a stronger Glove.",
    pressure: "Deal +10 FLAT extra damage to Bosses.",
    greed: "Gain +10% Cash, but suffer +10% higher Penalties.",
    mirror: "Broken Mirror: +20% Luck, but -10% Cash.",
    infra: "Massive 15% boost to ALL income sources.",
    efficiency: "Stacks value 10% faster. Great for late game.",
    precision: "5% Chance to deal Double Damage (Crit) to bosses.",
    titan: "+20 FLAT Boss Damage. Melts bosses.",
    bailout: "Lowers the Bankruptcy limit by $100.",
    magnet: "Increases item hitbox size by 20%.",
    blood: "Huge +40% Cash boost, but +40% Penalty.",
    time: "Slows time by 20%, but spawns items 30% faster.",
    awakening: "Bosses have +50% HP but give Double Rewards.",
    fragile: "Cash x2. Shields disabled. One miss hurts.",
    corrupt: "+30% Luck. Common items become worthless.",
    collapse: "VOLATILE: 30% Chance on sort to Gamble. If hit: 50% for 3x Profit, 50% for -4x Loss (Negative).",
    void: "Doubles the value gained from stacking items, but reduces total cash flow by 15%.",
    acid_vial: "TOXIC: Reduces Global Cash by 3% and Boss Damage by 1 per vial."
};

// --- REDESIGNED COMPONENTS ---

const Bin = ({ category, onClick, isTarget, shake, float }) => {
  const config = {
    [CAT_RECYCLE]: { color: 'from-blue-600 to-blue-400', shadow: 'shadow-blue-500/50', icon: <Recycle className="text-white drop-shadow-md" size={32} />, label: "RECYCLE", glow: 'blue' },
    [CAT_COMPOST]: { color: 'from-emerald-600 to-emerald-400', shadow: 'shadow-emerald-500/50', icon: <Leaf className="text-white drop-shadow-md" size={32} />, label: "COMPOST", glow: 'green' },
    [CAT_TRASH]: { color: 'from-slate-700 to-slate-500', shadow: 'shadow-slate-600/50', icon: <Trash2 className="text-white drop-shadow-md" size={32} />, label: "TRASH", glow: 'slate' },
  };
  
  const { color, shadow, icon, label, glow } = config[category];

  return (
    <button 
      onPointerDown={(e) => { e.preventDefault(); onClick(category); }}
      className={`
        relative w-full h-28 rounded-2xl flex flex-col items-center justify-center 
        transition-all duration-150 active:scale-95 z-30 overflow-hidden group
        bg-gradient-to-br ${color} border-t border-white/20 shadow-lg ${shadow}
        ${isTarget ? 'ring-4 ring-yellow-400 scale-105 brightness-125' : ''}
        ${shake ? 'animate-shake-crazy' : ''} ${float ? 'animate-float' : ''}
      `}
    >
      <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay pointer-events-none"></div>
      <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300 pointer-events-none">{icon}</div>
      <div className="text-[10px] font-black text-white tracking-[0.2em] uppercase bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 pointer-events-none">{label}</div>
      <div className="absolute bottom-0 w-full flex justify-center gap-2 pb-2 opacity-50 pointer-events-none">
         <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
         <div className="w-1 h-1 rounded-full bg-white animate-pulse delay-75"></div>
         <div className="w-1 h-1 rounded-full bg-white animate-pulse delay-150"></div>
      </div>
    </button>
  );
};

const ChaosToast = ({ data }) => (
  <div className="absolute pointer-events-none z-[60] flex flex-col items-center justify-center mix-blend-screen"
    style={{ left: data.x, top: data.y, opacity: data.life, transform: `translate(-50%, -${data.age * 0.8}px)` }}
  >
    <div className={`font-black text-center leading-none whitespace-nowrap drop-shadow-[0_0_5px_rgba(0,0,0,0.8)] ${data.color} ${data.shake ? 'animate-shake-crazy' : ''}`}
      style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: data.size + 'px', transform: `rotate(${data.rot}deg)`, transition: 'all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28)', textShadow: '0 0 10px currentColor' }}
    >
      {data.text}
      {data.subtext && <div className="text-[10px] text-white font-mono mt-1 bg-black/50 px-2 rounded">{data.subtext}</div>}
    </div>
  </div>
);

// --- MAIN APP ---

export default function App() {
  const state = useRef({
    spawnTimer: 0,
    bossTimer: BOSS_TIMER_DURATION,
    items: [], 
    money: 0,
    wave: 1,
    penalty: STARTING_PENALTY,
    bankruptcyBase: STARTING_BANKRUPTCY_LIMIT, 
    bankruptcyLimit: STARTING_BANKRUPTCY_LIMIT,
    bossActive: false,
    bossHealth: 100,
    bossMaxHealth: 100,
    bossTrait: 'none', 
    inventory: {}, 
    selectedUid: null,
    gameOver: false,
    gameWon: false,
    gameLostByFlood: false,
    shopOpen: false,
    menu: 'start',
    baseLuck: 1.0, 
    shopSelection: [], 
    lastTime: 0,
    toasts: [], 
    shake: 0, 
    binOrder: [CAT_RECYCLE, CAT_COMPOST, CAT_TRASH],
    glitchTimer: 0,
    freezerTimer: 0,
    shield: 0, 
    maxShield: 0,
    collapseTimer: 0,
    methaneFog: 0,
    methaneSpeedMult: 1.0,
    carbonMeter: 0,
    floodLevel: 0,
    endlessMode: false,
    showRegulation: false, 
    acidPuddles: [],
    
    // DECOUPLED CHEAT STATE
    cheat_godMode: false,
    cheat_perkRain: false,
    cheat_spawnRateMult: 1,
    cheat_forceBoss: 'random'
  });

  const [ui, setUi] = useState({
    money: 0,
    inventory: {},
    wave: 1,
    bossActive: false,
    bossHealth: 100,
    bossMaxHealth: 100,
    bossTimer: BOSS_TIMER_DURATION,
    bossTrait: 'none',
    penalty: STARTING_PENALTY,
    items: [],
    selectedUid: null,
    gameOver: false,
    gameWon: false,
    gameLostByFlood: false,
    shopOpen: false,
    menu: 'start',
    bankruptcyLimit: STARTING_BANKRUPTCY_LIMIT,
    inspectItem: null,
    currentLuck: 1.0,
    shopSelection: [],
    invTab: 'waste', 
    binOrder: [CAT_RECYCLE, CAT_COMPOST, CAT_TRASH],
    shake: 0,
    bossDying: false,
    guideTab: 'basics',
    cheatBossTime: 90,
    cheatMoney: 0,
    cheatLuck: 1.0,
    cheatLimit: -200,
    godMode: false,
    forceBoss: 'random',
    perkRain: false,
    spawnRateMult: 1,
    settingsKey: 0,
    shield: 0,
    maxShield: 0,
    showRegulation: false,
    currentRegulation: null,
    methaneFog: 0,
    carbonMeter: 0,
    floodLevel: 0,
    endlessMode: false,
    acidPuddles: [],
    crtIntensity: 0.4
  });

  const [toasts, setToasts] = useState([]);
  
  // INDESTRUCTIBLE GAME LOOP REF
  const updateRef = useRef();

  // --- LOGIC FUNCTIONS (HOISTED) ---

  function calculateBuffs(currentInventory) {
    let additiveGlobal = 1.0;
    let multipliers = 1.0;
    let stackAdditive = 0; 
    let stackMultipliers = 1.0;
    let b = { fallSpeedMul: 1, flatShield: 0, baseRewardMul: 1, stackMul: 1, catMod: { [CAT_RECYCLE]: 1, [CAT_COMPOST]: 1, [CAT_TRASH]: 1 }, globalCashMul: 1, luckAdd: 0, bossDmgFlat: 0, bossDmgMul: 1, penaltyMul: 1, critChance: 0, bailout: 0, spawnRateMul: 1, bossRisk: false, shieldsDisabled: false, commonNerf: false, hitboxMul: 1, acidDebuff: 0 };

    Object.keys(currentInventory).forEach(id => {
      let perkItem = PERK_DB.find(i => i.id === id);
      if (id === 'acid_vial') perkItem = ACID_ITEM;
      if (perkItem) {
        const count = currentInventory[id];
        if (count > 0) {
           switch(perkItem.type) {
            case 'speed': b.fallSpeedMul += (perkItem.val * count); break;
            case 'flatShield': b.flatShield += (perkItem.val * count); break;
            case 'baseReward': b.baseRewardMul += (perkItem.val * count); break;
            case 'stackBonus': stackAdditive += (perkItem.val * count); break;
            case 'catMod': b.catMod[perkItem.target] += (perkItem.val * count); break;
            case 'globalCash': additiveGlobal += (perkItem.val * count); break;
            case 'risk': additiveGlobal += (0.1 * count); b.penaltyMul += (0.1 * count); break;
            case 'blood': additiveGlobal += (0.4 * count); b.penaltyMul += (0.4 * count); break;
            case 'tradeLuck': additiveGlobal -= (0.1 * count); b.luckAdd += (0.2 * count); break;
            case 'corrosive': b.acidDebuff += count; additiveGlobal -= (0.03 * count); b.bossDmgFlat -= (1 * count); break;
            case 'glassCannon': multipliers *= Math.pow(2, count); b.shieldsDisabled = true; break;
            case 'luck': b.luckAdd += (perkItem.val * count); break;
            case 'bossDmg': b.bossDmgFlat += (perkItem.val * count); break; 
            case 'bossDmgFlat': b.bossDmgFlat += (perkItem.val * count); break; 
            case 'crit': b.critChance += (perkItem.val * count); break;
            case 'bailout': b.bailout += (perkItem.val * count); break;
            case 'hitbox': b.hitboxMul += (perkItem.val * count); break;
            case 'chaos': b.fallSpeedMul -= (0.2 * count); b.spawnRateMul += (0.3 * count); break;
            case 'bossRisk': b.bossRisk = true; break;
            case 'corruptLuck': b.luckAdd += (0.3 * count); b.commonNerf = true; break;
            case 'void': stackMultipliers *= Math.pow(2, count); additiveGlobal -= (0.15 * count); break;
            default: break;
          }
        }
      }
    });
    b.fallSpeedMul = Math.max(0.2, b.fallSpeedMul);
    additiveGlobal = Math.max(0.1, additiveGlobal);
    b.globalCashMul = additiveGlobal * multipliers;
    b.stackMul = (1 + stackAdditive) * stackMultipliers;
    return b;
  }

  function getActiveBuffs() {
     return calculateBuffs(state.current.inventory);
  }

  function getWeightedItem(pool, luck) {
    const poolWithWeights = pool.map(item => {
      let weight = 100;
      if (item.rarity === 'common') weight = Math.max(10, 400 - (luck * 10)); 
      else if (item.rarity === 'uncommon') weight = 50 * luck;
      else if (item.rarity === 'rare') weight = 20 * luck;
      else if (item.rarity === 'epic') weight = 5 * luck;
      else if (item.rarity === 'legendary') weight = 2 * luck;
      else if (item.rarity === 'lunar') weight = 1 * luck;
      return { item, weight };
    });
    const totalWeight = poolWithWeights.reduce((a, b) => a + b.weight, 0);
    let random = Math.random() * totalWeight;
    for (const entry of poolWithWeights) {
      if (random < entry.weight) return entry.item;
      random -= entry.weight;
    }
    return pool[0].item;
  }

  function getShopSelection(luck) {
    const w = { common: 300, uncommon: 150, rare: 50, legendary: 10, lunar: 2 };
    let pool = PERK_DB.map(p => {
      let weight = w[p.rarity] || 10;
      if (['rare', 'legendary', 'lunar'].includes(p.rarity)) { weight *= luck; }
      return { ...p, weight };
    });
    const selected = [];
    for (let i = 3; i > 0; i--) {
      if (pool.length === 0) break;
      const total = pool.reduce((a, b) => a + b.weight, 0);
      let r = Math.random() * total;
      let pickedIndex = -1;
      for (let j = 0; j < pool.length; j++) {
        r -= pool[j].weight;
        if (r <= 0) { pickedIndex = j; break; }
      }
      if (pickedIndex === -1) pickedIndex = 0;
      selected.push(pool[pickedIndex]);
      pool.splice(pickedIndex, 1);
    }
    return selected;
  }

  function startGame() {
    playSound('click');
    const startMoney = ui.cheatMoney !== 0 ? parseFloat(ui.cheatMoney) : 0;
    const startLuck = ui.cheatLuck !== 1.0 ? parseFloat(ui.cheatLuck) : 1.0;
    const startLimit = ui.cheatLimit !== -200 ? parseFloat(ui.cheatLimit) : STARTING_BANKRUPTCY_LIMIT;
    const startTimer = parseFloat(ui.cheatBossTime) || BOSS_TIMER_DURATION;

    // Reset state directly
    state.current = {
      ...state.current,
      money: startMoney,
      wave: 1,
      penalty: STARTING_PENALTY,
      bankruptcyBase: startLimit,
      bankruptcyLimit: startLimit,
      items: [],
      inventory: {},
      bossActive: false,
      bossHealth: 100,
      bossMaxHealth: 100,
      bossTrait: 'none', 
      selectedUid: null,
      gameOver: false,
      gameWon: false,
      gameLostByFlood: false,
      shopOpen: false,
      menu: 'none',
      baseLuck: startLuck,
      shopSelection: [],
      lastTime: performance.now(),
      toasts: [],
      shake: 0,
      binOrder: [CAT_RECYCLE, CAT_COMPOST, CAT_TRASH],
      glitchTimer: 0,
      freezerTimer: 0,
      shield: 0,
      maxShield: 0,
      collapseTimer: 0,
      methaneFog: 0,
      methaneSpeedMult: 1.0,
      carbonMeter: 0,
      floodLevel: 0,
      showRegulation: true, 
      endlessMode: false,
      acidPuddles: []
    };
    
    // Sync UI to state
    setUi(prev => ({ 
      ...prev, 
      money: startMoney, 
      wave: 1, 
      penalty: STARTING_PENALTY,
      bossActive: false, 
      menu: 'none', 
      gameOver: false,
      gameWon: false,
      gameLostByFlood: false,
      inventory: {},
      items: [],
      currentLuck: startLuck,
      inspectItem: null,
      binOrder: [CAT_RECYCLE, CAT_COMPOST, CAT_TRASH],
      invTab: 'waste',
      bossDying: false,
      bossTimer: startTimer,
      bankruptcyLimit: startLimit,
      shield: 0,
      maxShield: 0,
      showRegulation: true, 
      currentRegulation: REGULATIONS[1],
      methaneFog: 0,
      carbonMeter: 0,
      floodLevel: 0,
      endlessMode: false,
      acidPuddles: []
    }));
  }

  function spawnItem() {
    let newItem;
    let isPerk = false;
    let isHazard = false;
    let isHardPlastic = false;
    let isContaminated = false;

    // Use current active buffs for logic
    const buffs = getActiveBuffs();
    const activeWave = state.current.wave;
    const eWasteBoost = activeWave >= 3 ? 0.3 : 0; 
    const rigidChance = activeWave >= 4 ? 0.3 : 0;
    const contamChance = activeWave >= 6 ? 0.25 : 0;

    if (state.current.bossActive) {
      if (state.current.bossTrait === 'flood') {
         newItem = BOSS_ITEMS[Math.floor(Math.random() * BOSS_ITEMS.length)];
      } else if (state.current.bossTrait === 'acid') {
         if (Math.random() < 0.75) { newItem = ACID_ITEM; } else { newItem = BOSS_ITEMS[Math.floor(Math.random() * BOSS_ITEMS.length)]; }
      } else if (state.current.bossTrait === 'gambler') {
         newItem = BOSS_ITEMS[Math.floor(Math.random() * BOSS_ITEMS.length)];
      } else if (state.current.bossTrait === 'mimic') {
         if (Math.random() < 0.5) { newItem = BOSS_ITEMS[Math.floor(Math.random() * BOSS_ITEMS.length)]; isHazard = true; } else { newItem = BOSS_ITEMS[Math.floor(Math.random() * BOSS_ITEMS.length)]; }
      } else {
         const template = BOSS_ITEMS[Math.floor(Math.random() * BOSS_ITEMS.length)];
         newItem = template;
      }
      newItem = { ...newItem, isBossItem: true };
    } else {
      const hazardChance = 0.02 + (state.current.wave * 0.01);
      if (state.current.cheat_perkRain) {
        isPerk = true;
        newItem = PERK_DB[Math.floor(Math.random() * PERK_DB.length)];
      } else if (Math.random() < hazardChance && !state.current.cheat_godMode) {
        newItem = HAZARD_ITEM;
        isHazard = true;
      } else {
        const rand = Math.random();
        if (rand < eWasteBoost) {
           const eWaste = WASTE_DB.filter(i => ['battery', 'smartwatch', 'laptop'].includes(i.id));
           newItem = eWaste[Math.floor(Math.random() * eWaste.length)];
        } 
        else if (rand < eWasteBoost + rigidChance) {
           const plastics = WASTE_DB.filter(i => i.cat === CAT_RECYCLE && i.id !== 'paper'); 
           newItem = plastics[Math.floor(Math.random() * plastics.length)];
           isHardPlastic = true;
        }
        else if (rand < eWasteBoost + rigidChance + contamChance) {
           const recycles = WASTE_DB.filter(i => i.cat === CAT_RECYCLE);
           newItem = recycles[Math.floor(Math.random() * recycles.length)];
           isContaminated = true;
        }
        else {
           const totalLuck = state.current.baseLuck + buffs.luckAdd;
           const perkChance = Math.min(0.10, 0.01 * totalLuck); 
           if (Math.random() < perkChance) { isPerk = true; newItem = PERK_DB[Math.floor(Math.random() * PERK_DB.length)]; } else { newItem = getWeightedItem(WASTE_DB, totalLuck); }
        }
      }
    }
    
    if (!newItem) return;

    let variance = Math.random() * 0.6 + 0.7; 
    if (state.current.bossTrait === 'rush') variance = 2.0;
    if (state.current.bossTrait === 'iron') variance = 0.5;
    if (state.current.bossTrait === 'sniper') variance = 3.0; 
    if (state.current.bossTrait === 'swarm') variance = 0.4;
    if (state.current.bossTrait === 'flood') variance = 1.2; 

    const baseSpeed = state.current.bossActive ? 0.35 : 0.15;
    const waveMod = state.current.wave * 0.05; 
    let chaosMult = window.ECO_SETTINGS.chaos ? 2.0 : 1.0;
    const methaneMult = state.current.methaneSpeedMult || 1.0;
    const finalSpeed = (baseSpeed + waveMod) * buffs.fallSpeedMul * variance * chaosMult * methaneMult;

    let opacity = 1.0;
    if (state.current.bossTrait === 'phantom') opacity = 0.3 + (Math.random() * 0.4);

    state.current.items.push({
      ...newItem,
      uid: Date.now() + Math.random(),
      x: 10 + Math.random() * 80, 
      y: -15, 
      speed: finalSpeed, 
      rotation: Math.random() * 360,
      isPerkDrop: isPerk,
      isHazard: isHazard,
      opacity: opacity,
      isGambler: state.current.bossTrait === 'gambler',
      gamblerTimer: 0,
      isHardPlastic, 
      isContaminated, 
      crackCount: 0 
    });
  }

  function update(time) {
    if (state.current.menu !== 'none' || state.current.shopOpen || state.current.gameOver || state.current.gameWon || state.current.showRegulation) {
      state.current.lastTime = time; 
      return; 
    }

    state.current.lastTime = time;
    const buffs = getActiveBuffs(); // Live calculation inside loop

    // 1. Spawning
    if (!state.current.bossDying) {
      state.current.spawnTimer++;
      let baseRate = state.current.bossActive ? 70 : 90;
      baseRate = Math.max(20, baseRate - (state.current.wave * 4)); 
      
      if (state.current.bossTrait === 'swarm') baseRate = 10; 
      if (state.current.bossTrait === 'sniper') baseRate = 120; 
      if (state.current.bossTrait === 'flood') baseRate = 30; 
      
      let chaosRate = window.ECO_SETTINGS.chaos ? 0.5 : 1.0;
      let cheatRate = 1.0 / state.current.cheat_spawnRateMult; 
      let methaneRate = 1.0 / (state.current.methaneSpeedMult || 1.0);

      let finalRate = (baseRate / buffs.spawnRateMul) * chaosRate * cheatRate * methaneRate;

      if (state.current.spawnTimer > finalRate) {
        spawnItem();
        state.current.spawnTimer = 0;
      }
    }

    // 2. Timers
    if (!state.current.bossActive && state.current.bossTimer > 0) {
      state.current.bossTimer -= 1/60; 
      if (state.current.bossTimer <= 0) startBoss(buffs);
    }

    // 2.5 Regulation Effects
    if (state.current.wave >= 5 && !state.current.bossActive) { 
       if (state.current.carbonMeter >= 85) { 
          state.current.money -= Math.max(0.01, state.current.money * 0.001);
       }
    }

    if (state.current.methaneFog > 0) {
       state.current.methaneFog -= 0.2; 
    }
    
    if (state.current.acidPuddles.length > 0) {
        state.current.acidPuddles = state.current.acidPuddles.filter(p => {
            p.life -= 0.005;
            return p.life > 0;
        });
    }

    // 3. Boss Logics
    if (state.current.bossTrait === 'glitch' && !state.current.bossDying) {
        state.current.glitchTimer++;
        if (state.current.glitchTimer > 400 && state.current.glitchTimer < 500) {
           if (state.current.glitchTimer % 10 === 0 && !window.ECO_SETTINGS.ecoMode) setUi(p => ({...p, shake: 2}));
        }
        if (state.current.glitchTimer > 500) {
           const bins = [CAT_RECYCLE, CAT_COMPOST, CAT_TRASH];
           state.current.binOrder = bins.sort(() => 0.5 - Math.random());
           setUi(p => ({...p, binOrder: state.current.binOrder}));
           addToast("GLITCH SWAP!", "text-cyan-400", "50%", "50%", 30, 24);
           playSound('hit');
           state.current.glitchTimer = 0;
        }
    }

    if (state.current.bossTrait === 'quantum' && !state.current.bossDying) {
       if (state.current.spawnTimer % 30 === 0 && state.current.items.length > 0) {
          const idx = Math.floor(Math.random() * state.current.items.length);
          if (state.current.items[idx]) {
             state.current.items[idx].x = 10 + Math.random() * 80;
          }
       }
    }

    let freezeMult = 1.0;
    if (state.current.bossTrait === 'freezer' && !state.current.bossDying) {
        state.current.freezerTimer++;
        if (state.current.freezerTimer < 300) {
        } else if (state.current.freezerTimer < 500) {
           freezeMult = 0;
           if (state.current.freezerTimer === 301) {
             addToast("FREEZE!", "text-cyan-200", "50%", "30%", 40);
             playSound('alarm');
           }
        } else {
           state.current.freezerTimer = 0;
           addToast("SHATTER!", "text-white", "50%", "50%", 50);
           playSound('explode');
           state.current.items.forEach(i => i.speed *= 1.05); 
        }
    }

    const speedMult = state.current.bossDying ? 0.1 : 1.0;
    const effectiveLimit = state.current.bankruptcyBase - buffs.bailout;
    state.current.bankruptcyLimit = effectiveLimit;

    state.current.items = state.current.items.filter(item => {
       if (item.isGambler) {
          item.gamblerTimer = (item.gamblerTimer || 0) + 1;
          if (item.gamblerTimer > 50) { 
             const newTmpl = BOSS_ITEMS[Math.floor(Math.random() * BOSS_ITEMS.length)];
             item.icon = newTmpl.icon;
             item.cat = newTmpl.cat;
             item.gamblerTimer = 0;
          }
       }

      item.y += item.speed * speedMult * freezeMult; 
      
      if (item.y > FLOOR_THRESHOLD) {
        if (!state.current.bossDying) { 
          if (item.isHazard) {
            addToast("SAFE", "text-slate-400", `${item.x}%`, "90%", 20);
          } else {
            if (state.current.bossTrait === 'flood') {
                state.current.floodLevel += 5; 
                playSound('splash');
                if (state.current.floodLevel >= 100) {
                    state.current.gameOver = true;
                    state.current.gameLostByFlood = true; 
                    setUi(prev => ({ ...prev, gameOver: true, gameLostByFlood: true }));
                }
            } else {
                if (state.current.wave >= 3 && ['battery', 'smartwatch', 'laptop'].includes(item.id)) {
                    state.current.maxShield = Math.max(0, state.current.maxShield - 2); 
                    state.current.acidPuddles.push({x: item.x, life: 1.0, id: Date.now()}); 
                    const currentVials = state.current.inventory['acid_vial'] || 0;
                    state.current.inventory['acid_vial'] = currentVials + 1;
                    addToast("+ACID VIAL", "text-lime-300", "50%", "50%", 20);
                    setUi(prev => ({...prev, inventory: {...state.current.inventory}}));
                    playSound('explode');
                }

                let rawPenalty = item.isBossItem ? state.current.penalty * 1.5 : state.current.penalty;
                rawPenalty *= buffs.penaltyMul;
                let finalPenalty = rawPenalty;
                
                if (state.current.wave >= 6 && item.isContaminated) {
                    finalPenalty = Math.max(50, Math.floor(state.current.money * 0.5)); 
                    addToast("TOXIC LEAK!", "text-green-500", `${item.x}%`, "90%", 25);
                }

                if (!buffs.shieldsDisabled) finalPenalty = Math.max(0, finalPenalty - buffs.flatShield);
                applyPenalty(finalPenalty);
            }
          }
        }
        if (state.current.selectedUid === item.uid) state.current.selectedUid = null;
        return false; 
      }
      return true;
    });

    state.current.toasts.forEach(t => {
      t.age = (t.age || 0) + 1;
      if (t.sequence && t.sequence.length > 0) {
         const nextStage = t.sequence[0];
         if (t.age >= nextStage.delay) {
            t.text = nextStage.text;
            t.color = nextStage.color || t.color;
            t.size = nextStage.size || t.size;
            t.shake = nextStage.shake || false;
            t.rot = nextStage.rot !== undefined ? nextStage.rot : (Math.random() * 20 - 10);
            playSound('pop'); 
            t.sequence.shift(); 
            t.life = Math.min(1.0, t.life + 0.3); 
         }
      }
      t.life -= 0.015; 
    });
    state.current.toasts = state.current.toasts.filter(t => t.life > 0);

    if (window.ECO_SETTINGS.ecoMode) {
      state.current.shake = 0;
    } else if (state.current.shake > 0) {
      state.current.shake *= 0.9;
    }

    if (state.current.regulation?.mechanic !== 'acid_leak') {
        const totalItems = Object.values(state.current.inventory).reduce((a, b) => a + b, 0);
        state.current.shield = totalItems * BASE_SHIELD_PER_ITEM;
    }

    setUi(prev => ({
      ...prev,
      items: [...state.current.items],
      money: state.current.money,
      bossTimer: Math.ceil(state.current.bossTimer),
      bossHealth: Math.ceil(state.current.bossHealth),
      bossMaxHealth: state.current.bossMaxHealth,
      bossActive: state.current.bossActive,
      gameOver: state.current.gameOver,
      selectedUid: state.current.selectedUid,
      penalty: state.current.penalty,
      currentLuck: state.current.baseLuck + buffs.luckAdd,
      bankruptcyLimit: effectiveLimit,
      shake: state.current.shake,
      bossTrait: state.current.bossTrait,
      bossDying: state.current.bossDying,
      shield: state.current.shield,
      maxShield: state.current.maxShield,
      methaneFog: state.current.methaneFog,
      carbonMeter: state.current.carbonMeter,
      floodLevel: state.current.floodLevel,
      acidPuddles: [...state.current.acidPuddles],
      gameLostByFlood: state.current.gameLostByFlood,
      crtIntensity: window.ECO_SETTINGS.crtOpacity,
      
      // Keep UI cheats in sync
      godMode: state.current.cheat_godMode,
      perkRain: state.current.cheat_perkRain,
      spawnRateMult: state.current.cheat_spawnRateMult,
      forceBoss: state.current.cheat_forceBoss
    }));
    
    setToasts([...state.current.toasts]);
  }

  // --- BULLETPROOF LOOP ---
  useEffect(() => {
    updateRef.current = update;
  });

  useEffect(() => {
    let rafId;
    const tick = (time) => {
      try {
        if (updateRef.current) updateRef.current(time);
      } catch (e) {
        console.error("Ecoing Loop Error:", e);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // --- LOGIC HELPERS ---
  function setMenuState(menuName) {
    playSound('click');
    state.current.menu = menuName;
    if (menuName === 'none') {
        state.current.lastTime = performance.now();
    }
    setUi(prev => ({ ...prev, menu: menuName, inspectItem: null }));
  }

  function addToast(text, color, x, y, size = 20, subtext = null, sequence = null) {
    state.current.toasts.push({
      id: Date.now() + Math.random(),
      text,
      color,
      x,
      y,
      size,
      subtext,
      rot: (Math.random() - 0.5) * 20,
      life: 1.0,
      age: 0,
      sequence: sequence
    });
  }

  function startBoss(buffs) {
    playSound('alarm');
    state.current.bossActive = true;
    let hp = state.current.bossMaxHealth;
    if (buffs.bossRisk) hp = Math.floor(hp * 1.5);
    
    let trait = 'none';
    if (state.current.wave === 7 && !state.current.endlessMode) {
        trait = 'flood';
    } else {
        const traits = ['none', 'glitch', 'rush', 'phantom', 'iron', 'acid', 'quantum', 'swarm', 'sniper', 'gambler', 'mimic', 'freezer'];
        trait = state.current.cheat_forceBoss !== 'random' ? state.current.cheat_forceBoss : (state.current.wave > 1 ? traits[Math.floor(Math.random() * traits.length)] : 'none');
    }
    
    state.current.bossTrait = trait;
    state.current.bossHealth = hp;
    state.current.bossMaxHealth = hp; 
    state.current.items = [];
    state.current.freezerTimer = 0;
    
    let bossName = "TRASH TITAN";
    if (trait === 'glitch') bossName = "GLITCH PRIME";
    if (trait === 'rush') bossName = "SPEED DEMON";
    if (trait === 'phantom') bossName = "THE PHANTOM";
    if (trait === 'iron') { bossName = "IRON CLAD"; state.current.bossHealth *= 2; state.current.bossMaxHealth *= 2; }
    if (trait === 'acid') bossName = "ACIDIFY";
    if (trait === 'quantum') bossName = "QUANTUM CORE";
    if (trait === 'swarm') bossName = "THE SWARM";
    if (trait === 'sniper') bossName = "THE SNIPER";
    if (trait === 'gambler') bossName = "THE GAMBLER";
    if (trait === 'mimic') bossName = "THE MIMIC";
    if (trait === 'freezer') bossName = "ABSOLUTE ZERO";
    if (trait === 'flood') { bossName = "THE CLOG"; state.current.bossHealth *= 2; state.current.bossMaxHealth *= 2; } 

    addToast(bossName, "text-red-500", "50%", "30%", 40, "WAVE " + state.current.wave);
  }

  function triggerBossDeath() {
    state.current.bossDying = true;
    state.current.items = []; 
    if (window.ECO_SETTINGS.shake) state.current.shake = 20;
    
    playSound('explode');
    addToast("TARGET DESTROYED", "text-red-500", "50%", "50%", 40);
    
    if (state.current.bossTrait === 'flood' && !state.current.endlessMode) {
        setTimeout(() => {
            state.current.gameWon = true;
            setUi(p => ({...p, gameWon: true}));
        }, 1000);
        return;
    }

    setUi(p => ({...p, bossDying: true}));

    setTimeout(() => {
      openShop();
    }, 2000);
  }

  function openShop() {
    state.current.bossActive = false;
    state.current.bossDying = false;
    state.current.bossTimer = parseFloat(ui.cheatBossTime) || BOSS_TIMER_DURATION;
    state.current.bossTrait = 'none';
    state.current.binOrder = [CAT_RECYCLE, CAT_COMPOST, CAT_TRASH]; 
    state.current.wave += 1;
    state.current.baseLuck += 0.1; 
    state.current.penalty += 5; 
    state.current.methaneSpeedMult = 1.0; 
    state.current.bankruptcyBase += BANKRUPTCY_INCREASE_PER_WAVE;
    state.current.items = [];
    state.current.bossMaxHealth = state.current.bossMaxHealth + 50; 
    state.current.glitchTimer = 0;
    state.current.freezerTimer = 0;
    state.current.floodLevel = 0;

    const safeReg = REGULATIONS[state.current.wave] || null; 
    if (safeReg && !state.current.endlessMode) {
        state.current.regulation = safeReg;
    } else {
        state.current.regulation = null; 
    }
    
    if (state.current.regulation?.mechanic !== 'acid_leak') {
        const totalItems = Object.values(state.current.inventory).reduce((a, b) => a + b, 0);
        state.current.shield = totalItems * BASE_SHIELD_PER_ITEM;
    }

    const buffs = getActiveBuffs(); 
    let reward = 100 * state.current.wave;
    if (buffs.bossRisk) reward *= 2;
    state.current.money += reward;
    
    const shuffled = [...PERK_DB].sort(() => 0.5 - Math.random());
    state.current.shopSelection = getShopSelection(state.current.baseLuck + buffs.luckAdd);

    state.current.shopOpen = true;
    state.current.gameWon = false;
    state.current.bossActive = false; 

    setUi(prev => ({ 
      ...prev, 
      shopOpen: true, 
      shopSelection: state.current.shopSelection,
      wave: state.current.wave, 
      penalty: state.current.penalty,
      money: state.current.money,
      binOrder: state.current.binOrder,
      bossDying: false,
      showRegulation: false, 
      floodLevel: 0, 
      gameWon: false,
      bossActive: false 
    }));
  }

  function applyPenalty(amount) {
    if (state.current.cheat_godMode) return;
    if (amount <= 0) return;
    const buffs = getActiveBuffs();

    if (!buffs.shieldsDisabled && state.current.shield > 0) {
       if (state.current.shield >= amount) {
          state.current.shield -= amount;
          playSound('shieldHit');
          addToast("SHIELD BLOCKED", "text-blue-400", "50%", "50%", 20);
          return; 
       } else {
          amount -= state.current.shield;
          state.current.shield = 0;
          playSound('shieldHit');
       }
    }
    
    state.current.money -= amount;
    if (window.ECO_SETTINGS.shake) state.current.shake = 5; 
    addToast(`-$${amount.toFixed(2)}`, "text-red-500", "50%", "50%", 30);
    playSound('hit');
    
    const limit = state.current.bankruptcyLimit;

    if (state.current.money <= limit) {
      state.current.gameOver = true;
      setUi(prev => ({ ...prev, gameOver: true }));
    }
  }

  function handleItemClick(e, item) {
    e.stopPropagation();
    if (item.isHazard) {
      if (window.ECO_SETTINGS.shake) state.current.shake = 20; 
      state.current.money -= 100;
      addToast("BOOM!", "text-red-600", `${item.x}%`, `${item.y}%`, 50, "-$100");
      state.current.items = state.current.items.filter(i => i.uid !== item.uid);
      playSound('explode');
      if (!state.current.cheat_godMode && state.current.money <= state.current.bankruptcyLimit) {
        state.current.gameOver = true;
        setUi(prev => ({ ...prev, gameOver: true }));
      }
      return;
    }

    if (item.isHardPlastic && item.crackCount < 1) {
       item.crackCount++;
       playSound('crack'); 
       item.rotation += 15;
       item.x += (Math.random() - 0.5) * 5;
       addToast("CRACK!", "text-yellow-400", `${item.x}%`, `${item.y}%`, 20);
       return; 
    }

    state.current.selectedUid = item.uid;
    setUi(prev => ({ ...prev, selectedUid: item.uid }));
    playSound('select');
  }

  function handleBinClick(binCategory) {
    const { selectedUid, items } = state.current;
    if (!selectedUid) return;

    const item = items.find(i => i.uid === selectedUid);
    if (!item) return;

    const buffs = getActiveBuffs();
    const isCorrect = item.cat === binCategory;

    if (item.isContaminated) {
       if (binCategory !== CAT_TRASH) {
           addToast("CONTAMINATED!", "text-green-600", "50%", "50%", 30);
           const fine = Math.max(50, Math.floor(state.current.money * 0.5));
           applyPenalty(fine);
           state.current.items = state.current.items.filter(i => i.uid !== selectedUid);
           state.current.selectedUid = null;
           setUi(prev => ({ ...prev, selectedUid: null }));
           return;
       } else {
           addToast("SAFE DISPOSAL", "text-slate-500", "50%", "50%", 20);
           playSound('success');
           if (state.current.wave >= 5) {
               state.current.carbonMeter = Math.min(100, state.current.carbonMeter + 15); 
               addToast("+CO2", "text-red-400", "80%", "20%", 15);
           }
           state.current.items = state.current.items.filter(i => i.uid !== selectedUid);
           state.current.selectedUid = null;
           setUi(prev => ({ ...prev, selectedUid: null }));
           return;
       }
    }

    if (item.cat === binCategory) {
      if (item.isBossItem) {
        let bossDmgBase = 10 + buffs.bossDmgFlat;
        let scaledDmg = bossDmgBase * buffs.stackMul;
        let dmg = Math.max(1, scaledDmg);
        if (item.id === 'acid_vial') { dmg = 1; }
        if (Math.random() < buffs.critChance) { dmg *= 2; addToast("CRIT!", "text-yellow-500", `${item.x}%`, "38%", 30); } else { addToast(`-${dmg.toFixed(0)}`, "text-red-600", `${item.x}%`, "38%", 20); }
        playSound('attack');
        if (state.current.bossTrait === 'flood') { state.current.floodLevel = Math.max(0, state.current.floodLevel - 5); }
        state.current.bossHealth -= dmg;
        if (item.id === 'acid_vial') {
           const currentCount = state.current.inventory[item.id] || 0;
           state.current.inventory[item.id] = currentCount + 1;
           addToast("ACID COLLECTED!", "text-lime-400", `${item.x}%`, "45%", 25, "-STATS");
           setUi(prev => ({ ...prev, inventory: { ...state.current.inventory } }));
        }
        if (state.current.bossHealth <= 0) { triggerBossDeath(); }
      } else {
        if (state.current.wave >= 5) {
            if (binCategory === CAT_TRASH) state.current.carbonMeter = Math.min(100, state.current.carbonMeter + 4); 
            else state.current.carbonMeter = Math.max(0, state.current.carbonMeter - 2); 
        }
        const currentCount = state.current.inventory[item.id] || 0;
        state.current.inventory[item.id] = currentCount + 1;
        if (!buffs.shieldsDisabled) { state.current.shield += BASE_SHIELD_PER_ITEM; }
        if (item.isPerkDrop) {
           addToast(`${item.name}`, "text-purple-400", "50%", "30%", 25, "UNLOCKED");
           playSound('success');
        } else {
           let base = BASE_REWARD * buffs.baseRewardMul;
           let rarityBonus = RARITY[item.rarity].val;
           if (buffs.commonNerf && item.rarity === 'common') { base = 0; rarityBonus = 0; }
           let rawValue = base + ((currentCount * rarityBonus) * buffs.stackMul);
           let profit = rawValue * buffs.catMod[item.cat] * buffs.globalCashMul;
           let collapseActive = false;
           let collapseResult = 0; 
           if (state.current.inventory['collapse'] > 0) {
              if (Math.random() < 0.30) { 
                 collapseActive = true;
                 if (Math.random() < 0.50) { profit *= 3; collapseResult = 1; } else { profit *= -4; collapseResult = -1; }
              }
           }
           const itemRarityColor = safeRarity(item.rarity).text;
           const sequence = [];
           const firstModifiers = [];
           const middleModifiers = []; 
           if (state.current.inventory['training'] > 0) firstModifiers.push({name: "TRAINING", rarity: 'common'});
           if (item.cat === CAT_RECYCLE && state.current.inventory['subsidy'] > 0) middleModifiers.push({name: "SUBSIDY", rarity: 'uncommon'});
           if (item.cat === CAT_COMPOST && state.current.inventory['grant'] > 0) middleModifiers.push({name: "GRANT", rarity: 'uncommon'});
           if (item.cat === CAT_TRASH && state.current.inventory['tax'] > 0) middleModifiers.push({name: "TAX CREDIT", rarity: 'uncommon'});
           if (currentCount > 0) { 
              if (state.current.inventory['storage'] > 0) middleModifiers.push({name: "STORAGE", rarity: 'common'});
              if (state.current.inventory['efficiency'] > 0) middleModifiers.push({name: "EFFICIENCY", rarity: 'legendary'});
           }
           if (state.current.inventory['infra'] > 0) middleModifiers.push({name: "INFRA", rarity: 'legendary'});
           if (state.current.inventory['combo'] > 0) middleModifiers.push({name: "CASH FLOW", rarity: 'uncommon'}); 
           if (state.current.inventory['blood'] > 0) middleModifiers.push({name: "BLOOD", rarity: 'lunar'});
           if (state.current.inventory['fragile'] > 0) middleModifiers.push({name: "FRAGILE", rarity: 'lunar'});
           if (state.current.inventory['greed'] > 0) middleModifiers.push({name: "GREED", rarity: 'rare'});
           if (state.current.inventory['void'] > 0) middleModifiers.push({name: "VOID", rarity: 'lunar'});
           if (state.current.inventory['mirror'] > 0) middleModifiers.push({name: "MIRROR", rarity: 'rare'});
           if (state.current.inventory['acid_vial'] > 0) middleModifiers.push({name: "ACID", rarity: 'toxic'});
           middleModifiers.sort(() => 0.5 - Math.random());
           const activeModifiers = [...firstModifiers, ...middleModifiers];
           activeModifiers.forEach(mod => {
              const modColor = safeRarity(mod.rarity).text;
              sequence.push({ text: mod.name, color: modColor, size: 18, delay: 20 + (activeModifiers.indexOf(mod) * 15) });
           });
           let baseDelay = 20 + (activeModifiers.length * 15);
           if (collapseActive) {
              if (collapseResult === 1) {
                 sequence.push({ text: "MARKET BOOM", color: "text-purple-400", size: 14, delay: baseDelay });
                 sequence.push({ text: "3X VALUE", color: "text-green-400", size: 20, delay: baseDelay + 20 });
                 baseDelay += 40;
              } else {
                 sequence.push({ text: "MARKET CRASH", color: "text-red-600", size: 14, delay: baseDelay });
                 sequence.push({ text: "-4X VALUE", color: "text-red-500", size: 20, delay: baseDelay + 20 });
                 baseDelay += 40;
              }
           }
           if (profit > 0) {
              sequence.push({ text: `+$${profit.toFixed(2)}`, color: "text-green-500", size: 30, shake: true, rot: 0, delay: baseDelay + 15 }); 
              addToast(`+$${BASE_REWARD}`, itemRarityColor, `${item.x}%`, `${item.y}%`, 16, null, sequence);
              playSound('success');
           } else {
              sequence.push({ text: `-$${Math.abs(profit).toFixed(2)}`, color: "text-red-500", size: 30, shake: true, rot: 0, delay: baseDelay + 15 }); 
              addToast(`-$${Math.abs(profit).toFixed(2)}`, "text-red-500", `${item.x}%`, `${item.y}%`, 16, null, sequence);
              playSound('hit');
           }
           state.current.money += profit;
        }
        setUi(prev => ({ ...prev, inventory: { ...state.current.inventory } }));
      }
    } else {
      if (state.current.wave >= 2 && item.cat === CAT_COMPOST && binCategory === CAT_TRASH) {
          state.current.methaneFog = 100; 
          state.current.methaneSpeedMult += 0.2; 
          addToast("METHANE LEAK!", "text-lime-400", "50%", "50%", 30);
          setUi(p => ({...p, methaneFog: 100})); 
      }
      let rawPenalty = state.current.penalty * buffs.penaltyMul;
      if (!buffs.shieldsDisabled) rawPenalty = Math.max(0, rawPenalty - buffs.flatShield);
      applyPenalty(rawPenalty);
    }
    state.current.items = state.current.items.filter(i => i.uid !== selectedUid);
    state.current.selectedUid = null;
    setUi(prev => ({ ...prev, selectedUid: null }));
  }

  const deleteItem = (itemId) => {
    playSound('click');
    const count = state.current.inventory[itemId];
    if (count > 0) {
      state.current.inventory[itemId] = count - 1;
      state.current.shield = Math.max(0, state.current.shield - BASE_SHIELD_PER_ITEM);
      setUi(prev => ({ ...prev, inventory: { ...state.current.inventory } }));
    }
  };

  const unlockAll = () => {
    const all = [...WASTE_DB, ...PERK_DB];
    all.forEach(i => {
      state.current.inventory[i.id] = (state.current.inventory[i.id] || 0) + 1;
    });
    setUi(p => ({...p, inventory: {...state.current.inventory}}));
    addToast("UNLOCKED ALL", "text-green-400", "50%", "50%", 40);
  };

  const skipWave = () => {
    if (state.current.bossActive) triggerBossDeath();
    else startBoss(getActiveBuffs());
  };

  const hudOrder = window.ECO_SETTINGS.leftHanded ? 'flex-row-reverse' : 'flex-row';
  
  const getBackground = () => {
    if (ui.bossActive) return 'bg-red-950';
    if (ui.menu === 'start') return 'menu-bg';
    return 'bg-slate-900';
  };

  return (
    <div 
      className={`fixed inset-0 w-full h-full font-sans overflow-hidden select-none touch-manipulation flex justify-center text-white transition-colors duration-1000 bg-black`}
      style={{
        transform: `translate(${(Math.random() - 0.5) * ui.shake}px, ${(Math.random() - 0.5) * ui.shake}px)`
      }}
    >
       <style dangerouslySetInnerHTML={{__html: `
        ${STYLES}
      `}} />
      
      {/* 1. GLOBAL CRT SCANLINES (Topmost Layer) */}
      <div className="crt-scanlines" style={{opacity: ui.crtIntensity}}></div>
      
      {/* 2. Holographic Overlay Grid */}
      <div className="holo-overlay"></div>

      <div className={`relative w-full h-full max-w-lg overflow-hidden flex flex-col z-10 ${getBackground()}`}>
        
        {/* --- REGULATION VISUALS --- */}
        <div className="fixed inset-0 pointer-events-none z-[60] fog-flow transition-opacity duration-1000" style={{opacity: ui.methaneFog > 0 ? 1 : 0, visibility: ui.methaneFog > 0 ? 'visible' : 'hidden'}}></div>
        
        {ui.acidPuddles.map(p => (
            <div key={p.id} className="absolute bottom-32 w-24 h-8 bg-lime-400/30 rounded-[100%] blur-md pointer-events-none transition-opacity z-10" style={{left: `${p.x}%`, transform: 'translate(-50%)', opacity: p.life, boxShadow: '0 0 20px #84cc16'}}></div>
        ))}

        <div className="absolute bottom-0 w-full bg-blue-500/60 border-t border-blue-400 pointer-events-none z-[25] transition-all duration-300 backdrop-blur-sm" style={{height: `${ui.floodLevel}%`}}>
            <div className="w-full text-center text-white font-black text-xs pt-2 animate-pulse drop-shadow-md">FLOOD LEVEL: {ui.floodLevel}%</div>
        </div>

        {/* --- THE BLACK VOID SINK --- */}
        <div className="absolute bottom-0 w-full h-32 void-sink z-20 pointer-events-none"></div>

        {/* --- HUD --- */}
        <div className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-30 pointer-events-none ${hudOrder}`}>
          <div className="flex flex-col gap-2 pointer-events-auto">
            <div className={`
               holo-panel rounded-xl p-3 min-w-[120px] transition-all duration-300
               ${ui.money < 0 ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}
               ${ui.carbonMeter >= 85 ? 'bg-red-900/40 animate-pulse' : ''}
            `}>
               <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold tracking-widest mb-1">
                 <span>FUNDS</span>
                 <span className="text-cyan-400 flex items-center gap-1"><Shield size={10}/> {ui.shield.toFixed(1)}</span>
               </div>
               <div className={`flex items-center text-2xl font-mono font-bold tracking-tight holo-text-glow ${ui.money < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                 <span className="opacity-50 mr-1">$</span>
                 {ui.money.toFixed(2)}
               </div>
               
               <div className="w-full h-1 bg-slate-700/50 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-300" style={{width: `${Math.min(100, (ui.shield / Math.max(1, ui.maxShield)) * 100)}%`}}></div>
               </div>
            </div>
            
            {!ui.bossActive && (
              <div className="flex gap-2">
                <div className="holo-panel px-2 py-1 rounded text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                   <Clover size={12} /> {ui.currentLuck.toFixed(1)}x
                </div>
                <div className={`holo-panel px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${ui.bankruptcyLimit >= 0 ? 'text-orange-300 border-orange-500' : 'text-slate-400'}`}>
                   <TrendingUp size={12}/> LIMIT: {ui.bankruptcyLimit}
                </div>
              </div>
            )}
            
            {(ui.godMode || ui.spawnRateMult > 1) && (
              <button onClick={skipWave} className="holo-btn text-red-300 font-black text-xs py-2 px-3 rounded shadow animate-pulse pointer-events-auto backdrop-blur border-red-500">
                SKIP WAVE ⏭
              </button>
            )}
            
            {ui.wave >= 5 && !ui.bossActive && (
               <div className="holo-panel p-2 rounded-xl w-32 mt-2">
                  <div className="text-[8px] text-slate-400 font-bold flex justify-between mb-1">
                     <span>CO2 LEVEL</span>
                     <span className={ui.carbonMeter > 85 ? 'text-red-500 animate-pulse' : 'text-slate-300'}>{ui.carbonMeter}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                     <div className={`h-full transition-all duration-300 ${ui.carbonMeter > 85 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-gradient-to-r from-emerald-500 to-yellow-500'}`} style={{width: `${ui.carbonMeter}%`}}></div>
                  </div>
               </div>
            )}
          </div>

          {ui.menu === 'none' && (
            <div className={`holo-panel px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${ui.bossActive ? 'bg-red-900/40 text-red-100 animate-pulse border-red-500/50' : ''}`}>
              <Clock size={16} className={`text-cyan-400 ${ui.bossActive ? 'animate-spin text-red-500' : ''}`} />
              <span className="font-mono font-bold text-lg tracking-widest holo-text-glow">
                {ui.bossActive ? "BOSS" : `${Math.floor(ui.bossTimer / 60)}:${(Math.floor(ui.bossTimer) % 60).toString().padStart(2, '0')}`}
              </span>
            </div>
          )}

          <div className="flex gap-2 pointer-events-auto">
            {ui.menu === 'none' && (
              <button 
                onClick={() => setMenuState('paused')}
                className="holo-btn p-3 rounded-xl hover:text-cyan-300"
              >
                <Pause size={20} />
              </button>
            )}
            <button 
              onClick={() => setMenuState(ui.menu === 'inventory' ? 'none' : 'inventory')}
              className={`p-3 rounded-xl shadow-lg transition-all relative holo-panel ${ui.menu === 'inventory' ? 'bg-emerald-500/20 text-white border-emerald-500' : 'hover:text-emerald-300'}`}
            >
              <Briefcase size={20} />
              {Object.keys(ui.inventory).length > 0 && (
                <div className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                  {Object.values(ui.inventory).reduce((a,b)=>a+b,0)}
                </div>
              )}
            </button>
          </div>
        </div>

        {ui.bossActive && !ui.bossDying && ui.bossHealth === ui.bossMaxHealth && (
           <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
             <div className="bg-red-600/90 text-white text-6xl font-black px-8 py-4 rotate-[10deg] animate-pulse shadow-[0_0_50px_rgba(220,38,38,1)] border-4 border-white transform scale-100 backdrop-blur-md rounded-xl">
               WARNING
             </div>
           </div>
        )}

        {/* BOSS BAR */}
        {ui.bossActive && !ui.bossDying && (
          <div className="absolute top-24 left-6 right-6 z-20 animate-slide-down pointer-events-none">
            <div className="flex justify-center mb-2">
               <div className="bg-red-950/80 text-red-100 px-6 py-1 rounded-full font-black text-xs tracking-[0.3em] shadow-[0_0_15px_#991b1b] border border-red-500 backdrop-blur-md">
                 {(() => {
                    let key = 'TRASH TITAN';
                    if (ui.bossTrait === 'glitch') key = 'GLITCH PRIME';
                    if (ui.bossTrait === 'rush') key = 'SPEED DEMON';
                    if (ui.bossTrait === 'phantom') key = 'THE PHANTOM';
                    if (ui.bossTrait === 'acid') key = 'ACIDIFY';
                    if (ui.bossTrait === 'swarm') key = 'THE SWARM';
                    if (ui.bossTrait === 'sniper') key = 'THE SNIPER';
                    if (ui.bossTrait === 'quantum') key = 'QUANTUM CORE';
                    if (ui.bossTrait === 'gambler') key = 'THE GAMBLER';
                    if (ui.bossTrait === 'mimic') key = 'THE MIMIC';
                    if (ui.bossTrait === 'freezer') key = 'ABSOLUTE ZERO';
                    if (ui.bossTrait === 'iron') key = 'IRON CLAD';
                    if (ui.bossTrait === 'flood') key = 'THE CLOG';
                    return key;
                 })()}
             </div>
           </div>
            
            <div className="h-4 w-full bg-black/50 rounded-full border border-red-900/50 overflow-hidden backdrop-blur-sm shadow-inner relative">
               <div className="absolute inset-0 flex justify-evenly opacity-30 z-10">
                   {[...Array(10)].map((_, i) => <div key={i} className="w-px h-full bg-black"></div>)}
               </div>
              <div 
                className="h-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 transition-all duration-200 shadow-[0_0_10px_#ef4444]"
                style={{ width: `${(ui.bossHealth / ui.bossMaxHealth) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[8px] font-bold text-red-400 mt-1 uppercase tracking-widest font-mono">
              <span>WAVE {ui.wave} // TARGET_LOCK</span>
              <span>HP: {Math.ceil(ui.bossHealth)} / {ui.bossMaxHealth}</span>
            </div>
          </div>
        )}

        {/* --- GAME CANVAS --- */}
        <div 
          className="absolute inset-0 z-0" 
          onPointerDown={() => {
             state.current.selectedUid = null;
             setUi(prev => ({...prev, selectedUid: null}));
          }}
        >
           {ui.items.map(item => (
             <div
               key={item.uid}
               onPointerDown={(e) => handleItemClick(e, item)}
               className={`
                 absolute flex flex-col items-center justify-center transition-transform duration-100 cursor-pointer
                 ${ui.selectedUid === item.uid ? 'scale-125 z-50' : 'scale-100 z-10'}
               `}
               style={{
                 left: `${item.x}%`,
                 top: `${item.y}%`,
                 transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                 opacity: item.opacity || 1,
                 width: `${3.5 * (getActiveBuffs().hitboxMul || 1)}rem`,
                 height: `${3.5 * (getActiveBuffs().hitboxMul || 1)}rem`
               }}
             >
               {ui.selectedUid === item.uid && !item.isHazard && (
                 <div className="absolute w-[140%] h-[140%] rounded-full border-2 border-dashed border-yellow-400 animate-spin-slow pointer-events-none opacity-80"></div>
               )}
               
               {/* ITEM CARD - ROUNDED CLASSIC */}
               <div className={`
                 w-full h-full item-card flex items-center justify-center text-3xl overflow-hidden relative backdrop-blur-md transition-all duration-200
                 ${ui.selectedUid === item.uid ? 'border-yellow-400 bg-yellow-500/10' : item.isHazard ? 'border-red-500 bg-red-500/10 animate-pulse' : 'hover:bg-white/5'}
                 ${item.isBossItem ? 'border-red-500 bg-red-900/40' : ''}
                 ${item.isPerkDrop ? 'border-purple-400 bg-purple-500/10 animate-pulse' : ''}
                 ${item.id === 'acid_vial' ? 'border-lime-400 bg-lime-500/10' : ''}
               `}>
                 <div className="transform transition-transform hover:scale-110 drop-shadow-md pointer-events-none">{item.icon}</div>
                 
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                 {item.isContaminated && <div className="absolute inset-0 bg-lime-500/30 flex items-center justify-center animate-pulse border-4 border-lime-500 pointer-events-none"><div className="text-lime-200 text-[8px] font-black bg-lime-900 px-1 rounded transform -rotate-12">TOXIC</div></div>}
                 {item.isHardPlastic && item.crackCount < 1 && <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-grayscale pointer-events-none"><div className="text-slate-800 text-[8px] font-black bg-white px-1 border border-black transform rotate-12">RIGID</div></div>}
               </div>
               
               {item.isPerkDrop && (
                 <div className="bg-purple-600 text-white text-[8px] px-2 py-0.5 rounded-sm -mt-3 z-10 font-bold uppercase tracking-wider shadow-[0_0_10px_#a855f7] pointer-events-none">
                   PERK
                 </div>
               )}
               {item.isHazard && (
                 <div className="bg-red-600 text-white text-[8px] px-2 py-0.5 rounded-sm -mt-3 z-10 font-bold uppercase tracking-wider shadow-[0_0_10px_#dc2626] pointer-events-none">
                   DANGER
                 </div>
               )}
             </div>
           ))}
        </div>

        {toasts.map(t => <ChaosToast key={t.id} data={t} />)}

        {/* --- BINS --- */}
        <div className="absolute bottom-[2%] w-full flex gap-3 px-3 pb-4 z-30 transition-all duration-300">
          {ui.binOrder.map((cat, idx) => (
            <div key={idx} className="flex-1">
              <Bin 
                category={cat} 
                onClick={handleBinClick} 
                isTarget={state.current.selectedUid && ui.items.find(i=>i.uid===state.current.selectedUid)}
                shake={ui.bossTrait === 'glitch'}
                float={ui.bossTrait === 'flood'}
              />
            </div>
          ))}
        </div>

        {/* --- MENUS --- */}

        {ui.menu === 'start' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-white animate-fadeIn menu-bg">
            <div className="absolute inset-0 holo-overlay opacity-30 animate-pulse pointer-events-none"></div>
            <div className="relative z-10 text-center mb-12">
               <div className="inline-block p-1 rounded-full border border-cyan-500/30 bg-cyan-900/20 backdrop-blur-md mb-4 px-4 py-1 text-[10px] tracking-[0.3em] text-cyan-400 font-bold uppercase shadow-[0_0_15px_rgba(34,211,238,0.3)]">System Online</div>
               <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600 drop-shadow-[0_0_35px_rgba(6,182,212,0.6)] tracking-tighter" style={{fontFamily: 'Rajdhani'}}>
                  ECOING
               </h1>
               <div className="text-slate-400 font-mono text-xs tracking-[0.5em] mt-2 opacity-70">CYBERNETIC SORTING SIMULATION</div>
            </div>
            
            <div className="flex flex-col gap-4 w-full max-w-xs relative z-10">
              <button onClick={startGame} className="group relative holo-panel text-white font-black text-xl py-6 rounded-xl hover:bg-cyan-500/10 transition-all overflow-hidden border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.15)] cursor-pointer z-50 pointer-events-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                <div className="flex items-center justify-center gap-3 relative z-10 holo-text-glow pointer-events-none">
                   <Play fill="currentColor" size={24} /> INITIALIZE
                </div>
              </button>
              
              <div className="flex gap-4">
                <button onClick={() => setMenuState('guide')} className="holo-btn flex-1 py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-bold">
                  <BookOpen size={18}/> Manual
                </button>
                <button onClick={() => setMenuState('settings')} className="holo-btn flex-1 py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider font-bold">
                  <Settings size={18}/> Config
                </button>
              </div>
              
              <button 
                onClick={() => setMenuState('cheats')}
                className="mt-8 text-[10px] text-slate-500 uppercase tracking-widest hover:text-cyan-400 font-bold flex items-center justify-center gap-2 transition-colors font-mono cursor-pointer relative z-50 pointer-events-auto"
              >
                <Terminal size={12} /> <span className="border-b border-dashed border-slate-600">Developer Override</span>
              </button>
            </div>
          </div>
        )}
        
        {/* --- GUIDE MENU --- */}
        {ui.menu === 'guide' && (
          <div className="absolute inset-0 z-[80] flex flex-col animate-fadeIn text-white menu-bg">
             <div className="flex bg-slate-900/50 p-2 gap-2 overflow-x-auto shrink-0 border-b border-cyan-500/30 relative z-10 pt-4">
               {['basics', 'economy', 'bestiary', 'regulations', 'hazards', 'perks', 'catalog', 'secrets'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setUi(p=>({...p, guideTab: tab}))}
                   className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap border ${ui.guideTab === tab ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-transparent text-slate-400 hover:text-white hover:border-white/10'}`}
                 >
                   {tab.toUpperCase()}
                 </button>
               ))}
             </div>

             <div className="flex-1 overflow-y-auto p-6 pb-24 custom-scrollbar relative z-10 w-full h-full">
               {ui.guideTab === 'basics' && (
                 <div className="space-y-6">
                   <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200 drop-shadow-sm font-rajdhani">GAMEPLAY</h2>
                   <div className="space-y-4 text-sm text-slate-300">
                     <p className="leading-relaxed border-l-2 border-cyan-500/50 pl-4">Ecoing is a high-speed sorting simulator designed to test your reflexes and economic management. Your goal is to survive endless waves of waste, defeat anomaly bosses, and avoid bankruptcy.</p>
                     <div className="holo-panel p-5 rounded-xl">
                       <h3 className="text-cyan-300 font-bold mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-cyan-500/20 pb-2"><Target size={16}/> Core Mechanics</h3>
                       <ul className="list-disc list-inside space-y-2 text-xs text-slate-400 font-mono">
                         <li><strong className="text-white">Step 1:</strong> Tap falling items to <span className="text-yellow-400">SELECT</span> them. A yellow ring will appear.</li>
                         <li><strong className="text-white">Step 2:</strong> Tap the correct <span className="text-blue-400">BIN</span> below (Blue/Green/Gray) to sort.</li>
                         <li><strong className="text-white">Step 3:</strong> Correct sorts earn money. Wrong sorts or missed items drain your funds.</li>
                       </ul>
                     </div>
                     <div className="holo-panel p-5 rounded-xl">
                       <h3 className="text-cyan-300 font-bold mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-cyan-500/20 pb-2"><ShieldCheck size={16}/> Defense Systems</h3>
                       <ul className="list-disc list-inside space-y-2 text-xs text-slate-400 font-mono">
                          <li><strong>Shield (Blue Bar):</strong> Absorbs penalty damage before it hits your cash.</li>
                          <li><strong>Generation:</strong> Gain +0.1 Shield for every item in your Stash.</li>
                          <li><strong>Regeneration:</strong> Shields fully restore at the start of every wave.</li>
                          <li><strong>Risk:</strong> Deleting items permanently lowers your max shield.</li>
                       </ul>
                     </div>
                   </div>
                 </div>
               )}
               
               {ui.guideTab === 'economy' && (
                 <div className="space-y-6">
                   <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-200 font-rajdhani">ECONOMY</h2>
                   <div className="grid gap-4">
                     <div className="holo-panel p-4 rounded-xl border border-white/5">
                       <div className="flex justify-between items-center mb-2">
                         <h3 className="text-white font-bold">Base Income</h3>
                         <span className="text-green-400 font-mono">$5.00</span>
                       </div>
                       <p className="text-xs text-slate-400 leading-relaxed">Basic trash (Bottles, Paper) has a flat value. It does not scale on its own. To increase your income, you must purchase upgrades.</p>
                     </div>
                     <div className="holo-panel p-4 rounded-xl border border-white/5">
                       <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2"><Briefcase size={16}/> The Permit System</h3>
                       <p className="text-xs text-slate-400 mb-4">Permits are passive upgrades found in the Shop after defeating a boss. You can buy multiple of the same permit to stack effects.</p>
                       <div className="space-y-3 font-mono text-xs">
                         <div className="flex justify-between border-b border-white/5 pb-2">
                           <div>
                             <div className="text-white font-bold">Subsidy / Grant</div>
                             <div className="text-[10px] text-slate-500">Category Modifier</div>
                           </div>
                           <div className="text-right">
                             <div className="text-green-400">+10%</div>
                             <div className="text-[10px] text-slate-500">Linear Stack</div>
                           </div>
                         </div>
                         <div className="flex justify-between border-b border-white/5 pb-2">
                           <div>
                             <div className="text-white font-bold">Global Cash</div>
                             <div className="text-[10px] text-slate-500">Universal Multiplier</div>
                           </div>
                           <div className="text-right">
                             <div className="text-purple-400">x1.5 - x2.0</div>
                             <div className="text-[10px] text-slate-500">Powerful</div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {ui.guideTab === 'perks' && (
                 <div className="space-y-6">
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-200 font-rajdhani">PERK DICTIONARY</h2>
                    <div className="space-y-2">
                       {Object.keys(PERK_DESCRIPTIONS).map(key => (
                          <div key={key} className="holo-panel p-3 rounded-lg">
                             <span className="text-white font-bold uppercase text-xs block mb-1 tracking-widest">{key.replace('_', ' ')}</span>
                             <span className="text-slate-400 text-xs font-mono">{PERK_DESCRIPTIONS[key]}</span>
                          </div>
                       ))}
                    </div>
                 </div>
               )}

               {ui.guideTab === 'regulations' && (
                  <div className="space-y-6">
                     <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 font-rajdhani">CIVIC MANDATES</h2>
                     <p className="text-xs text-slate-400">New laws are enacted every wave. You must adapt your sorting strategy or face penalties.</p>
                     <div className="space-y-4">
                        {Object.values(REGULATIONS).map((reg, idx) => (
                           <div key={idx} className="holo-panel p-4 rounded-xl">
                              <div className="flex justify-between items-center mb-1">
                                 <h3 className="font-bold text-emerald-200">{reg.title}</h3>
                                 <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded font-mono">WAVE {idx + 1}</span>
                              </div>
                              <p className="text-xs text-slate-300 mb-2">{reg.rule}</p>
                              <div className="bg-black/30 p-2 rounded text-[10px] text-slate-500 italic">"{reg.fact}"</div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {ui.guideTab === 'bestiary' && (
                  <div className="space-y-6">
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 font-rajdhani">BESTIARY</h2>
                    <p className="text-xs text-slate-400">Bosses appear every 90 seconds. Defeating them is the only way to access the Shop. Boss HP increases by +50 every wave.</p>
                    <div className="space-y-3">
                       {[{name:'Trash Titan', diff:'Easy', desc:'The standard boss. High HP, balanced attacks.'}, 
                         {name:'The Clog', diff:'FINAL', desc:'Final Boss of the Civic Update. Causes urban flooding. Water rises if you miss items. Defeat it to save the city.'}, 
                         {name:'Glitch Prime', diff:'Medium', desc:'Disrupts reality. Shuffles your bin positions randomly.'},
                         {name:'Speed Demon', diff:'Hard', desc:'Attacks at 2x speed. Requires rhythm.'},
                         {name:'The Phantom', diff:'Hard', desc:'Attacks flicker in and out of visibility.'},
                         {name:'Iron Clad', diff:'Medium', desc:'Massive Armor (2x HP). Attacks are slow but heavy.'},
                         {name:'The Swarm', diff:'Hard', desc:'Spawns 100s of low-speed items. Do not panic.'},
                         {name:'The Sniper', diff:'Extreme', desc:'Very few items, but they fall instantly. Reaction test.'},
                         {name:'Acidify', diff:'Extreme', desc:'Drops Acid Vials. If collected, they permanently debuff your stats until deleted from Inventory. These vials reduce boss damage.'},
                         {name:'Quantum Core', diff:'Extreme', desc:'Items teleport horizontally mid-air.'},
                         {name:'The Gambler', diff:'Medium', desc:'Items change shape and type while falling.'},
                         {name:'The Mimic', diff:'Hard', desc:'Drops fake "Perk" items that are actually hazards. Check carefully.'},
                         {name:'Absolute Zero', diff:'Hard', desc:'Freezes time, stacking attacks, then releases all at once.'}
                       ].map(b => (
                          <div key={b.name} className="holo-panel p-3 rounded-lg border-l-4 border-red-500/50">
                             <div className="flex justify-between mb-1">
                                <span className="font-bold text-red-200 tracking-wider">{b.name.toUpperCase()}</span>
                                <span className="text-[10px] bg-red-900/50 text-red-200 px-2 py-0.5 rounded border border-red-500/30">{b.diff.toUpperCase()}</span>
                             </div>
                             <span className="text-slate-400 text-xs font-mono">{b.desc}</span>
                          </div>
                       ))}
                    </div>
                  </div>
               )}

               {ui.guideTab === 'hazards' && (
                 <div className="space-y-6">
                   <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-200 font-rajdhani">HAZARDS</h2>
                   <div className="space-y-4">
                     <div className="holo-panel p-4 rounded-xl border-l-4 border-lime-500/50 flex gap-4">
                       <div className="text-3xl">☢️</div>
                       <div>
                         <h3 className="font-bold text-lime-400 mb-1">Toxic Waste</h3>
                         <p className="text-xs text-slate-300">A glowing green barrel. <strong>DO NOT CLICK.</strong> Let it hit the floor safely. Clicking causes an explosion (-$100).</p>
                       </div>
                     </div>
                     <div className="holo-panel p-4 rounded-xl border-l-4 border-yellow-500/50 flex gap-4">
                       <div className="text-3xl">🧪</div>
                       <div>
                         <h3 className="font-bold text-yellow-400 mb-1">Acid Vials</h3>
                         <p className="text-xs text-slate-300">Dropped by Acidify or Leaking Batteries (Wave 3). Permanently reduce your Shield Max Capacity.</p>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {ui.guideTab === 'catalog' && (
                 <div className="space-y-6 animate-fadeIn">
                   <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-200 font-rajdhani">ITEM DATABASE</h2>
                   <div className="grid grid-cols-4 gap-2">
                     {[...WASTE_DB, ...PERK_DB].map(item => (
                       <div key={item.id} className={`aspect-square holo-panel rounded-xl flex flex-col items-center justify-center border ${(RARITY[item.rarity] || RARITY.common).border.replace('border-', 'border-opacity-50 border-')}`}>
                         <div className="text-2xl mb-1 drop-shadow-md">{item.icon}</div>
                         <div className={`text-[8px] font-bold uppercase ${(RARITY[item.rarity] || RARITY.common).text}`}>{(RARITY[item.rarity] || RARITY.common).label}</div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {ui.guideTab === 'secrets' && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-200 font-rajdhani">CLASSIFIED</h2>
                    <div className="space-y-4">
                       <div className="holo-panel p-4 rounded-xl border border-purple-500/20">
                         <h3 className="text-fuchsia-400 font-bold mb-2 flex items-center gap-2"><Eye size={16}/> Drop Rates</h3>
                         <p className="text-xs text-slate-400 mb-2">Luck stats don't just increase rare drops—they aggressively decrease common drops.</p>
                         <ul className="text-xs space-y-1 text-slate-500 font-mono">
                            <li>Common Weight: 400 - (Luck * 10)</li>
                            <li>Uncommon Weight: 50 * Luck</li>
                            <li>Lunar Weight: 1 * Luck</li>
                         </ul>
                       </div>
                       <div className="holo-panel p-4 rounded-xl border border-purple-500/20">
                         <h3 className="text-fuchsia-400 font-bold mb-2 flex items-center gap-2"><Shield size={16}/> Shield Math</h3>
                         <p className="text-xs text-slate-400">Your max shield is calculated exactly: <strong>10 Items = 1 Shield Point</strong>. If you trash 10 items to clean your inventory, you lose 1 max shield capacity instantly.</p>
                       </div>
                       <div className="holo-panel p-4 rounded-xl border border-purple-500/20">
                         <h3 className="text-fuchsia-400 font-bold mb-2 flex items-center gap-2"><TrendingUp size={16}/> Debt Ceiling</h3>
                         <p className="text-xs text-slate-400">The bank gives you more credit as you progress. Your Bankruptcy limit increases by <strong>$30</strong> every wave. Survive long enough, and you can go thousands into debt.</p>
                       </div>
                       <div className="holo-panel p-4 rounded-xl border border-purple-500/20">
                         <h3 className="text-fuchsia-400 font-bold mb-2 flex items-center gap-2"><Zap size={16}/> Chaos Mode</h3>
                         <p className="text-xs text-slate-400">Chaos mode forces a flat <strong>2.0x Speed Multiplier</strong> on all items, stacking with other buffs. However, it also reduces spawn delays by 50%.</p>
                       </div>
                    </div>
                  </div>
               )}
             </div>
             
             {/* Back Button for Manual - Locked to Bottom */}
             <div className="p-4 border-t border-cyan-500/30 relative z-20 mt-auto w-full flex-shrink-0">
                <button onClick={() => setMenuState('start')} className="holo-btn w-full py-4 rounded-xl font-bold uppercase tracking-widest text-lg">BACK TO MENU</button>
             </div>
          </div>
        )}

        {/* --- SETTINGS MENU --- */}
        {ui.menu === 'settings' && (
          <div className="absolute inset-0 z-[80] flex flex-col animate-slide-up text-white p-6 menu-bg">
             <h2 className="text-3xl font-black mb-8 flex items-center gap-2 text-cyan-400 font-rajdhani tracking-widest relative z-10"><Settings /> CONFIG</h2>
             
             <div className="space-y-6 flex-1 relative z-10 custom-scrollbar overflow-y-auto">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Master Volume</label>
                   <div className="holo-panel p-4 rounded-xl">
                      <input 
                        type="range" min="0" max="1" step="0.1" 
                        defaultValue={window.ECO_SETTINGS.masterVolume}
                        onChange={(e) => {
                          window.ECO_SETTINGS.masterVolume = parseFloat(e.target.value);
                          setUi(p => ({...p, settingsKey: p.settingsKey + 1}));
                        }}
                        className="w-full accent-cyan-500"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">CRT Intensity</label>
                   <div className="holo-panel p-4 rounded-xl">
                      <input 
                        type="range" min="0" max="1" step="0.1" 
                        defaultValue={window.ECO_SETTINGS.crtOpacity}
                        onChange={(e) => {
                          window.ECO_SETTINGS.crtOpacity = parseFloat(e.target.value);
                          setUi(p => ({...p, crtIntensity: parseFloat(e.target.value)}));
                        }}
                        className="w-full accent-cyan-500"
                      />
                      <div className="text-right text-xs text-cyan-400 mt-1 font-mono">{Math.round(ui.crtIntensity * 100)}%</div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Visuals</label>
                   <div className="holo-panel rounded-xl divide-y divide-white/10">
                      <button 
                         onClick={() => {
                           window.ECO_SETTINGS.ecoMode = !window.ECO_SETTINGS.ecoMode;
                           setUi(p=>({...p, ecoMode: !p.ecoMode}));
                         }}
                         className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer"
                      >
                         <span className="flex items-center gap-2"><Battery size={16}/> Battery Saver</span>
                         <span className={ui.ecoMode ? "text-emerald-400 font-bold" : "text-slate-500"}>{ui.ecoMode ? "ON" : "OFF"}</span>
                      </button>
                      
                      <button 
                         onClick={() => {
                           window.ECO_SETTINGS.particles = !window.ECO_SETTINGS.particles;
                           setUi(p=>({...p, particles: !p.particles}));
                         }}
                         className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer"
                      >
                         <span className="flex items-center gap-2"><Star size={16}/> Particles</span>
                         <span className={ui.particles ? "text-cyan-400 font-bold" : "text-slate-500"}>{ui.particles ? "ON" : "OFF"}</span>
                      </button>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gameplay</label>
                   <div className="holo-panel rounded-xl divide-y divide-white/10">
                      <button 
                         onClick={() => {
                           window.ECO_SETTINGS.leftHanded = !ui.leftHanded;
                           setUi(p=>({...p, leftHanded: !p.leftHanded}));
                         }}
                         className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer"
                      >
                         <span className="flex items-center gap-2"><Layout size={16}/> Left-Handed Mode</span>
                         <span className={ui.leftHanded ? "text-emerald-400 font-bold" : "text-slate-500"}>{ui.leftHanded ? "ON" : "OFF"}</span>
                      </button>
                      <button 
                         onClick={() => {
                           window.ECO_SETTINGS.chaos = !window.ECO_SETTINGS.chaos;
                           setUi(p=>({...p, chaosMode: !p.chaosMode}));
                         }}
                         className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer"
                      >
                         <span className="flex items-center gap-2"><Radiation size={16}/> Chaos Mode (2x Speed)</span>
                         <span className={ui.chaosMode ? "text-red-400 font-bold" : "text-slate-500"}>{ui.chaosMode ? "ON" : "OFF"}</span>
                      </button>
                   </div>
                </div>
             </div>
             
             {/* Return Button Fixed at Bottom */}
             <div className="pt-4 mt-auto relative z-10 w-full flex-shrink-0">
                <button onClick={() => setMenuState('start')} className="holo-btn w-full py-4 rounded-xl font-bold uppercase tracking-widest">Return</button>
             </div>
          </div>
        )}

        {/* --- PAUSE MENU --- */}
        {ui.menu === 'paused' && (
           <div className="absolute inset-0 z-[90] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6">
              <h2 className="text-5xl font-black text-white mb-10 tracking-[0.5em] font-rajdhani text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">HALTED</h2>
              <div className="flex flex-col gap-4 w-full max-w-xs relative z-10">
                 <button onClick={() => setMenuState('none')} className="holo-panel bg-emerald-500/20 text-emerald-300 border-emerald-500 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-emerald-500/30 cursor-pointer">
                   <Play fill="currentColor" size={20} /> RESUME
                 </button>
                 <button onClick={startGame} className="holo-btn text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10">
                   <RotateCcw size={20} /> RESTART
                 </button>
                 <button onClick={() => setMenuState('start')} className="holo-btn text-slate-300 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10">
                   <Home size={20} /> MENU
                 </button>
              </div>
           </div>
        )}

        {/* --- CHEATS MENU --- */}
        {ui.menu === 'cheats' && (
          <div className="absolute inset-0 z-[100] flex flex-col p-6 text-green-500 font-mono animate-fadeIn overflow-hidden menu-bg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-green-800 pb-2 relative z-10"><Terminal /> DEBUG_CONSOLE_V.0.9</h2>
            
            <div className="space-y-6 overflow-y-auto pb-20 flex-1 custom-scrollbar relative z-10">
              <div className="flex gap-2">
                 <button onClick={() => {
                    const newMode = !ui.godMode;
                    setUi(p=>({...p, godMode: newMode}));
                    state.current.cheat_godMode = newMode;
                 }} className={`flex-1 border border-green-500/50 py-2 font-bold rounded cursor-pointer ${ui.godMode ? 'bg-green-900 text-green-100' : 'hover:bg-green-900/20'}`}>GOD_MODE: {ui.godMode ? 'ON' : 'OFF'}</button>
                 
                 <button onClick={unlockAll} className="flex-1 border border-green-500/50 py-2 font-bold rounded hover:bg-green-900/30 cursor-pointer">UNLOCK_ALL</button>
              </div>

              <div className="flex gap-2">
                 <button onClick={() => {
                    const newRain = !ui.perkRain;
                    setUi(p=>({...p, perkRain: newRain}));
                    state.current.cheat_perkRain = newRain;
                 }} className={`flex-1 border border-purple-500/50 text-purple-400 py-2 font-bold rounded cursor-pointer ${ui.perkRain ? 'bg-purple-900/50 text-purple-100' : 'hover:bg-purple-900/20'}`}>PERK_RAIN: {ui.perkRain ? 'ON' : 'OFF'}</button>
              </div>

              <div>
                <label className="text-xs uppercase opacity-70">Spawn Rate Multiplier</label>
                <input type="range" min="1" max="50" value={ui.spawnRateMult} onChange={(e) => {
                   const val = parseInt(e.target.value);
                   setUi(p=>({...p, spawnRateMult: val}));
                   state.current.cheat_spawnRateMult = val;
                }} className="w-full accent-green-500 cursor-pointer"/>
                <div className="text-right text-sm">{ui.spawnRateMult}x</div>
              </div>

              <div>
                <label className="text-xs uppercase opacity-70">Starting Funds ($)</label>
                <input type="number" value={ui.cheatMoney} onChange={(e) => {
                  setUi(p=>({...p, cheatMoney: e.target.value}));
                }} className="w-full bg-green-900/20 border border-green-700 rounded p-2 text-lg focus:outline-none text-green-400 font-mono"/>
              </div>

              <div>
                <label className="text-xs uppercase opacity-70">Base Luck Multiplier</label>
                <input 
                  type="number" 
                  value={ui.cheatLuck} 
                  onChange={(e) => {
                    setUi(p=>({...p, cheatLuck: e.target.value}));
                  }}
                  className="w-full bg-green-900/20 border border-green-700 rounded p-2 text-lg focus:outline-none text-green-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs uppercase opacity-70">Boss Timer (Seconds)</label>
                <input 
                  type="number" 
                  value={ui.cheatBossTime} 
                  onChange={(e) => {
                    setUi(p=>({...p, cheatBossTime: e.target.value}));
                  }}
                  className="w-full bg-green-900/20 border border-green-700 rounded p-2 text-lg focus:outline-none text-green-400 font-mono"
                />
              </div>

              <div>
                 <label className="text-xs uppercase opacity-70">Force Boss</label>
                 <div className="flex flex-wrap gap-2 mt-2">
                    {['random', 'flood', 'glitch', 'rush', 'phantom', 'iron', 'acid', 'quantum', 'swarm', 'sniper', 'gambler', 'mimic', 'freezer'].map(t => (
                       <button key={t} onClick={() => {
                          setUi(p=>({...p, forceBoss: t}));
                          state.current.cheat_forceBoss = t;
                       }} className={`px-2 py-1 text-[10px] border cursor-pointer ${ui.forceBoss === t ? 'bg-green-500 text-black' : 'border-green-800 text-green-700 hover:text-green-400'}`}>{t.toUpperCase()}</button>
                    ))}
                 </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-green-900 relative z-10 w-full flex-shrink-0">
               <button onClick={() => setMenuState('start')} className="flex-1 border border-green-800 py-4 font-bold rounded hover:bg-green-900/20 cursor-pointer">EXIT</button>
               <button onClick={() => { startGame(); playSound('success'); }} className="flex-[2] bg-green-600 text-black font-black py-4 rounded hover:bg-green-500 cursor-pointer">EXECUTE</button>
            </div>
          </div>
        )}

        {/* REGULATION MODAL */}
        {ui.showRegulation && ui.currentRegulation && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[60] flex flex-col items-center justify-center p-6 animate-fadeIn text-center">
                <div className="holo-panel p-8 rounded-3xl border border-cyan-500/30 max-w-sm w-full shadow-[0_0_50px_rgba(14,165,233,0.2)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 box-shadow-[0_0_20px_#0ea5e9]"></div>
                    <div className="flex flex-col items-center gap-6">
                        <div className="bg-cyan-500/20 p-4 rounded-full border border-cyan-500/50 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                           <FileText size={32} className="text-cyan-400"/>
                        </div>
                        <div>
                            <div className="text-[10px] font-black tracking-[0.3em] text-cyan-600 uppercase mb-2">MUNICIPAL ALERT // WAVE {ui.wave}</div>
                            <h2 className="text-3xl font-black text-white leading-none mb-6 font-rajdhani">{ui.currentRegulation.title}</h2>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 mb-4 text-left">
                                <p className="text-xs text-slate-400 italic leading-relaxed font-mono">"{ui.currentRegulation.fact}"</p>
                            </div>
                            <div className="text-left bg-cyan-500/10 p-5 rounded-xl border border-cyan-500/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-20"><AlertTriangle className="text-cyan-500"/></div>
                                <div className="text-[10px] font-bold text-cyan-400 uppercase mb-1 tracking-wider">NEW PROTOCOL</div>
                                <p className="text-sm font-bold text-cyan-100 leading-snug">{ui.currentRegulation.rule}</p>
                            </div>
                        </div>
                        <button onClick={() => { 
                           playSound('click'); 
                           if (ui.cheatBossTime) { state.current.bossTimer = parseFloat(ui.cheatBossTime); } 
                           state.current.showRegulation = false; 
                           setUi(p => ({...p, showRegulation: false})); 
                           state.current.lastTime = performance.now(); 
                        }} className="w-full bg-white hover:bg-cyan-50 text-slate-900 font-black py-4 rounded-xl shadow-lg mt-2 active:scale-95 transition-all text-lg uppercase tracking-widest cursor-pointer">
                            ACKNOWLEDGE
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* SHOP */}
        {ui.shopOpen && (
          <div className="absolute inset-0 z-50 flex flex-col p-6 text-white animate-fadeIn menu-bg">
            <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4 relative z-10">
              <div>
                 <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.2em] mb-1">Sector Cleared</div>
                 <h2 className="text-4xl font-black text-white font-rajdhani">MARKETPLACE</h2>
              </div>
              <div className="font-mono text-2xl text-emerald-400 font-bold drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">${ui.money.toFixed(2)}</div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pb-4 pr-1 custom-scrollbar relative z-10">
              {ui.shopSelection.map(item => {
                 const isOwned = state.current.inventory[item.id] > 0;
                 return (
                  <button 
                    key={item.id}
                    onClick={() => {
                      if (state.current.money >= item.price) {
                        playSound('buy');
                        state.current.money -= item.price;
                        const count = state.current.inventory[item.id] || 0;
                        state.current.inventory[item.id] = count + 1;
                        setUi(prev => ({ ...prev, money: state.current.money, inventory: { ...state.current.inventory } }));
                      } else { playSound('hit'); }
                    }}
                    disabled={ui.money < item.price}
                    className="w-full holo-panel p-3 rounded-xl flex items-center gap-3 hover:bg-white/5 disabled:opacity-40 active:scale-95 transition-all text-left relative overflow-hidden group border-l-4 border-l-transparent hover:border-l-emerald-500 cursor-pointer"
                  >
                     {isOwned && <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>}
                     <div className="bg-slate-800 w-14 h-14 rounded-lg flex items-center justify-center text-3xl shrink-0 border border-white/10 group-disabled:opacity-50 shadow-inner">{item.icon}</div>
                     <div className="flex-1 min-w-0">
                       <div className="font-bold text-base truncate flex items-center gap-2 text-white group-hover:text-emerald-300 transition-colors">
                         {item.name} 
                         <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${safeRarity(item.rarity).color} ${safeRarity(item.rarity).text} font-bold`}>{safeRarity(item.rarity).labelKey}</span>
                       </div>
                       <div className="text-xs text-slate-400 font-medium truncate mt-0.5">{item.perk || PERK_DESCRIPTIONS[item.id]}</div>
                     </div>
                     <div className="text-emerald-400 font-mono font-bold text-lg flex flex-col items-end">
                       <span>${item.price}</span>
                       {isOwned && <span className="text-[9px] text-slate-500 font-sans tracking-wide">OWNED: {state.current.inventory[item.id]}</span>}
                     </div>
                  </button>
                 );
              })}
            </div>

            <div className="mt-auto pt-4 border-t border-white/10 relative z-10 w-full flex-shrink-0">
                <button 
                  onClick={() => {
                    if (state.current.money >= SHOP_REROLL_COST) {
                       playSound('select');
                       state.current.money -= SHOP_REROLL_COST;
                       const shuffled = [...PERK_DB].sort(() => 0.5 - Math.random());
                       state.current.shopSelection = getShopSelection(state.current.baseLuck + getActiveBuffs().luckAdd);
                       setUi(prev => ({ ...prev, money: state.current.money, shopSelection: state.current.shopSelection }));
                    } else { playSound('hit'); }
                  }}
                  disabled={ui.money < SHOP_REROLL_COST}
                  className="w-full mb-3 bg-yellow-900/30 border border-yellow-500/30 text-yellow-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-yellow-900/50 transition-colors uppercase tracking-wider text-xs cursor-pointer"
                >
                  <RefreshCw size={14} /> Refresh Cycle (-${SHOP_REROLL_COST})
                </button>

                <div className="flex gap-3">
                  {ui.godMode && (
                    <button onClick={skipWave} className="flex-1 holo-btn text-slate-400 font-bold py-4 rounded-xl text-xs uppercase cursor-pointer">Dev Skip</button>
                  )}
                  <button 
                    onClick={() => {
                      playSound('click');
                      const nextReg = REGULATIONS[state.current.wave] || null;
                      if (ui.cheatBossTime) state.current.bossTimer = parseFloat(ui.cheatBossTime);
                      if (nextReg && !state.current.endlessMode) {
                          state.current.regulation = nextReg;
                          state.current.shopOpen = false;
                          state.current.showRegulation = true; 
                          setUi(p => ({...p, shopOpen: false, showRegulation: true, currentRegulation: nextReg }));
                      } else {
                          state.current.lastTime = performance.now(); 
                          state.current.shopOpen = false;
                          setUi(p => ({...p, shopOpen: false}));
                      }
                    }}
                    className="flex-[2] bg-emerald-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-400 active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                  >
                    DEPLOY WAVE {ui.wave} <FastForward size={16} fill="currentColor"/>
                  </button>
                </div>
            </div>
          </div>
        )}

        {/* --- OTHER SCREENS --- */}
        
        {ui.bossDying && (
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md z-50 flex items-center justify-center animate-fadeIn">
             <div className="holo-panel p-10 rounded-[2rem] border border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.3)] transform scale-110 animate-pulse text-center">
                <Skull size={80} className="mx-auto mb-4 text-emerald-400" />
                <h2 className="text-5xl font-black text-white font-rajdhani mb-2">DESTROYED</h2>
                <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
                <p className="text-sm text-emerald-300 mt-4 font-mono tracking-widest">ACCESSING BLACK MARKET...</p>
             </div>
          </div>
        )}

        {ui.gameOver && (
          <div className="absolute inset-0 bg-red-950/90 z-50 flex flex-col items-center justify-center p-8 backdrop-blur-xl text-white">
             {ui.gameLostByFlood ? (
                 <>
                    <div className="text-blue-400 mb-6 animate-bounce drop-shadow-[0_0_20px_#3b82f6]"><Droplet size={80} fill="currentColor"/></div>
                    <h2 className="text-6xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-blue-600">CRITICAL FAIL</h2>
                    <p className="text-blue-200 mb-10 font-mono text-sm text-center max-w-xs border border-blue-500/30 p-2 rounded bg-blue-900/30">CONTAINMENT BREACH: FLOOD LEVEL CRITICAL</p>
                 </>
             ) : (
                 <>
                    <Skull size={80} className="text-red-500 mb-6 drop-shadow-[0_0_30px_#ef4444]" />
                    <h2 className="text-6xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-300 to-red-600">INSOLVENT</h2>
                    <p className="text-red-300 mb-10 font-mono text-sm">Debt Threshold Exceeded ({ui.bankruptcyLimit})</p>
                 </>
             )}
             <div className="holo-panel p-6 rounded-2xl w-full mb-8 grid grid-cols-2 gap-4 text-center border border-white/10">
               <div>
                 <div className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">Sector Reached</div>
                 <div className="text-4xl font-black font-rajdhani">{ui.wave}</div>
               </div>
               <div>
                 <div className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">Assets Stashed</div>
                 <div className="text-4xl font-black font-rajdhani">{Object.values(ui.inventory).reduce((a,b)=>a+b, 0)}</div>
               </div>
             </div>
             <div className="flex gap-4 w-full">
               <button onClick={startGame} className="flex-[2] bg-white text-slate-900 font-black text-lg py-4 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-widest hover:bg-slate-200 cursor-pointer">
                 <RotateCcw size={20} /> Reboot System
               </button>
               <button onClick={() => setUi(p=>({...p, gameOver: false, menu: 'start'}))} className="flex-1 holo-btn text-white font-bold px-4 rounded-xl active:scale-95 uppercase tracking-widest text-xs cursor-pointer">
                 Exit
               </button>
             </div>
          </div>
        )}

        {/* INVENTORY */}
        {ui.menu === 'inventory' && (
          <div className="absolute inset-0 z-[70] flex flex-col animate-slide-up text-white menu-bg">
            <div className="holo-panel p-4 flex justify-between items-center z-10 sticky top-0 border-b border-white/10">
              <div className="flex gap-4 items-center">
                 <h2 className="text-xl font-black flex items-center gap-2 font-rajdhani tracking-widest"><Briefcase /> STASH</h2>
                 <div className="flex bg-slate-800 rounded-lg p-1 gap-1 border border-white/10">
                   <button onClick={() => { playSound('click'); setUi(p=>({...p, invTab: 'waste', inspectItem: null})); }} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${ui.invTab === 'waste' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Resources</button>
                   <button onClick={() => { playSound('click'); setUi(p=>({...p, invTab: 'perks', inspectItem: null})); }} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${ui.invTab === 'perks' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Permits</button>
                 </div>
              </div>
              <button onClick={() => setMenuState('none')} className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 pb-48 custom-scrollbar relative z-10">
               <div className="grid grid-cols-4 gap-3 content-start">
                  {Object.entries(ui.inventory).map(([id, count]) => {
                    let item = WASTE_DB.find(i => i.id === id) || PERK_DB.find(i => i.id === id);
                    if (id === 'acid_vial') item = ACID_ITEM; 
                    if (!item || count <= 0) return null;
                    if (ui.invTab === 'waste' && !!PERK_DB.find(i => i.id === id)) return null;
                    if (ui.invTab === 'perks' && !PERK_DB.find(i => i.id === id)) return null;

                    const rarity = safeRarity(item.rarity);
                    const isSelected = ui.inspectItem?.id === id;
                    const isToxic = item.rarity === 'toxic';

                    return (
                      <button 
                        key={id} 
                        onClick={() => { playSound('click'); setUi(p => ({...p, inspectItem: item})); }}
                        className={`aspect-square item-card flex flex-col items-center justify-center relative overflow-hidden cursor-pointer
                        ${isSelected ? 'border-emerald-400 scale-95' : 'hover:border-white/50'} 
                        ${isToxic ? 'animate-pulse border-lime-500/50' : ''}`}
                      >
                        <div className={`absolute top-0 left-0 w-full h-1 opacity-50 ${rarity.color.replace('bg-', 'bg-')}`}></div>
                        <div className="text-3xl drop-shadow-md pointer-events-none">{item.icon}</div>
                        <div className={`absolute bottom-1 right-1 text-[8px] font-black px-1.5 py-0.5 rounded ${rarity.color} ${rarity.text} pointer-events-none`}>x{count}</div>
                        {isToxic && <div className="absolute top-1 right-1 pointer-events-none"><AlertTriangle size={12} className="text-lime-500"/></div>}
                      </button>
                    );
                  })}
               </div>
            </div>
            {ui.inspectItem && (
                 <div className="absolute bottom-0 w-full holo-panel border-t border-emerald-500/30 rounded-t-3xl shadow-[0_-10px_50px_rgba(0,0,0,0.5)] p-6 animate-slide-up z-20">
                   <div className="flex gap-4 mb-6">
                     <div className="bg-slate-800 w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shrink-0 border border-white/10 shadow-inner">
                       {ui.inspectItem.icon}
                     </div>
                     <div className="flex-1">
                       <h3 className="font-bold text-2xl leading-none font-rajdhani mb-1 text-white">{ui.inspectItem.name}</h3>
                       <div className={`text-[10px] font-black uppercase mb-3 inline-block px-2 py-0.5 rounded ${safeRarity(ui.inspectItem.rarity).color} ${safeRarity(ui.inspectItem.rarity).text}`}>{safeRarity(ui.inspectItem.rarity).labelKey}</div>
                       <p className="text-xs text-slate-300 font-medium bg-black/30 p-3 rounded-xl border border-white/5 leading-relaxed font-mono">
                         {ui.inspectItem.perk || PERK_DESCRIPTIONS[ui.inspectItem.id] || 'Standard resource collectible. Base value $5.00.'}
                       </p>
                     </div>
                   </div>
                   <div className="flex gap-3">
                      <button onClick={() => deleteItem(ui.inspectItem.id)} className="flex-1 bg-red-500/10 text-red-400 font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-red-500/30 hover:bg-red-500/20 active:scale-95 transition-all uppercase tracking-wider cursor-pointer">
                        <Trash size={16} /> INCINERATE
                      </button>
                      <button onClick={() => { playSound('click'); setUi(p => ({...p, inspectItem: null})); }} className="flex-1 bg-white/10 text-white font-bold py-4 rounded-xl text-xs active:scale-95 transition-all uppercase tracking-wider hover:bg-white/20 cursor-pointer">
                        CLOSE PANEL
                      </button>
                   </div>
                 </div>
            )}
          </div>
        )}

        {/* --- VICTORY SCREEN --- */}
        {ui.gameWon && (
          <div className="absolute inset-0 bg-emerald-900/95 z-[60] flex flex-col items-center justify-center p-6 animate-fadeIn text-center text-white">
            <CheckCircle size={64} className="text-emerald-400 mb-4" />
            <h2 className="text-5xl font-black mb-2">CITY SAVED</h2>
            <p className="text-emerald-200 mb-8 max-w-xs">You prevented the flood and cleared the clog. The city's drainage system is operational.</p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => {
                  playSound('click');
                  state.current.endlessMode = true;
                  state.current.gameWon = false;
                  setUi(p => ({...p, gameWon: false, endlessMode: true}));
                  openShop();
                }}
                className="bg-white text-emerald-900 font-black py-4 rounded-xl shadow-xl active:scale-95 transition-transform cursor-pointer"
              >
                CONTINUE (ENDLESS)
              </button>
              <button 
                onClick={() => setMenuState('start')}
                className="bg-emerald-800 text-emerald-200 font-bold py-4 rounded-xl active:scale-95 transition-transform cursor-pointer"
              >
                RETIRE (MAIN MENU)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
