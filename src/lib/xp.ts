// XP & Tier System Engine
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan

import type { TierLevel, SessionMode } from '@prisma/client';

export const TIER_CONFIG = {
  BRONZE:   { min: 0,    max: 999,   label: 'Bronze',   emoji: '🥉', color: '#cd7f32' },
  SILVER:   { min: 1000, max: 2499,  label: 'Silver',   emoji: '🥈', color: '#c0c0c0' },
  GOLD:     { min: 2500, max: 4999,  label: 'Gold',     emoji: '🥇', color: '#ffd700' },
  PLATINUM: { min: 5000, max: 9999,  label: 'Platinum', emoji: '💎', color: '#e0f7fa' },
  ELITE:    { min: 10000, max: Infinity, label: 'Elite', emoji: '👑', color: '#c77dff' },
} as const;

export const XP_TABLE = {
  BASE_CORRECT:   10,
  STREAK_3:       15,  // bonus per streak milestone
  STREAK_5:       25,
  STREAK_10:      50,
  PERFECT_SCORE:  100, // 100% accuracy bonus
  SPEED_BONUS:    5,   // per second under par time
  FIRST_ATTEMPT:  20,  // first time completing a subtest
  SERIOUS_MULTIPLIER: 1.5,
} as const;

export interface XPResult {
  baseXP:      number;
  streakBonus: number;
  speedBonus:  number;
  modeBonus:   number;
  totalXP:     number;
}

export function calculateXP(params: {
  correctCount:  number;
  totalQuestions:number;
  streak:        number;
  timeSpentSec:  number;
  timeLimitSec:  number;
  mode:          SessionMode;
  isFirstAttempt:boolean;
}): XPResult {
  const { correctCount, totalQuestions, streak, timeSpentSec, timeLimitSec, mode, isFirstAttempt } = params;

  const baseXP = correctCount * XP_TABLE.BASE_CORRECT;

  let streakBonus = 0;
  if (streak >= 10) streakBonus = XP_TABLE.STREAK_10;
  else if (streak >= 5) streakBonus = XP_TABLE.STREAK_5;
  else if (streak >= 3) streakBonus = XP_TABLE.STREAK_3;

  const accuracy = correctCount / totalQuestions;
  const perfectBonus = accuracy === 1.0 ? XP_TABLE.PERFECT_SCORE : 0;

  const timeRemaining = Math.max(0, timeLimitSec - timeSpentSec);
  const speedBonus = Math.floor(timeRemaining / 60) * XP_TABLE.SPEED_BONUS;

  const firstBonus = isFirstAttempt ? XP_TABLE.FIRST_ATTEMPT : 0;

  const rawTotal = baseXP + streakBonus + perfectBonus + speedBonus + firstBonus;
  const modeBonus = mode === 'SERIOUS'
    ? Math.floor(rawTotal * (XP_TABLE.SERIOUS_MULTIPLIER - 1))
    : 0;

  return {
    baseXP,
    streakBonus: streakBonus + perfectBonus + firstBonus,
    speedBonus,
    modeBonus,
    totalXP: rawTotal + modeBonus,
  };
}

export function getTierFromPoints(points: number): TierLevel {
  if (points >= TIER_CONFIG.ELITE.min)    return 'ELITE';
  if (points >= TIER_CONFIG.PLATINUM.min) return 'PLATINUM';
  if (points >= TIER_CONFIG.GOLD.min)     return 'GOLD';
  if (points >= TIER_CONFIG.SILVER.min)   return 'SILVER';
  return 'BRONZE';
}

export function getLevelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForNextLevel(level: number): number {
  return level * level * 100;
}

export function getTierProgress(points: number, tier: TierLevel): number {
  const config = TIER_CONFIG[tier];
  if (tier === 'ELITE') return 100;
  const range = config.max - config.min;
  return Math.min(100, Math.round(((points - config.min) / range) * 100));
}
