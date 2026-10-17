import {
  pointsInRange,
  roundDivision,
} from '../../../core/utils/math.utils.js';
import type { Player } from '../entities/player.entity.js';
import type { PlayerWithDynamicValues } from '../interfaces/player.interface.js';
import { PlayerCondition, PlayerPosition } from '../enums/players.enum.js';

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

const ATTRIBUTE_WEIGHTS: Record<PlayerPosition, PlayerAttributes> = {
  [PlayerPosition.GOL]: {
    pace: 10,
    shooting: 0,
    passing: 20,
    dribbling: 0,
    defending: 40,
    physical: 30,
  },
  [PlayerPosition.ZAG]: {
    pace: 10,
    shooting: 0,
    passing: 15,
    dribbling: 0,
    defending: 45,
    physical: 30,
  },
  [PlayerPosition.LAT]: {
    pace: 25,
    shooting: 0,
    passing: 20,
    dribbling: 15,
    defending: 25,
    physical: 15,
  },
  [PlayerPosition.MEI]: {
    pace: 10,
    shooting: 15,
    passing: 35,
    dribbling: 25,
    defending: 5,
    physical: 10,
  },
  [PlayerPosition.ATA]: {
    pace: 20,
    shooting: 40,
    passing: 10,
    dribbling: 20,
    defending: 0,
    physical: 10,
  },
};

const CONDITION_DISCOUNT_BASIS_POINTS: Record<PlayerCondition, number> = {
  [PlayerCondition.APTO]: 0,
  [PlayerCondition.MAL_CONDICIONADO]: 1500,
  [PlayerCondition.DOENTE]: 3000,
};

const HUNDRED_PERCENT_BASIS_POINTS = 10000;
const MAX_DISCOUNT_BASIS_POINTS = -4000;
const MIN_VALUE = 100;
const YOUNG_PROSPECT_MAX_AGE = 21;

export function calculateOverall(
  position: PlayerPosition,
  attributes: PlayerAttributes,
): number {
  const weights = ATTRIBUTE_WEIGHTS[position];
  const attributeNames = Object.keys(weights) as (keyof PlayerAttributes)[];

  const weightedSum = attributeNames.reduce((sum, attribute) => {
    const value = attributes[attribute];
    const weight = weights[attribute];

    return sum + value * weight;
  }, 0);

  return roundDivision(weightedSum, 100);
}

export function calculateBaseValueCents(
  overall: number,
  potential: number,
  age: number,
): number {
  let overallPart =
    50 * pointsInRange(overall, 41, 60) +
    200 * pointsInRange(overall, 61, 75) +
    600 * pointsInRange(overall, 76, 99);

  if (age <= YOUNG_PROSPECT_MAX_AGE) {
    overallPart = roundDivision(overallPart * (100 + potential - overall), 100);
  }

  return Math.max(overallPart, MIN_VALUE);
}

function conditionDiscountBasisPoints(
  condition: PlayerCondition,
  agility: number,
): number {
  const discount = CONDITION_DISCOUNT_BASIS_POINTS[condition];
  if (condition === PlayerCondition.APTO) return discount;
  if (agility >= 80) return discount / 2;
  if (agility <= 30) return discount + 1000;
  return discount;
}

function ageAdjustmentBasisPoints(age: number): number {
  if (age <= YOUNG_PROSPECT_MAX_AGE) return 1000;
  if (age >= 32) return -1000;
  return 0;
}

export function calculateMarketValueCents(
  baseValueCents: number,
  condition: PlayerCondition,
  agility: number,
  age: number,
): number {
  const discountBasisPoints = conditionDiscountBasisPoints(condition, agility);
  const totalBasisPoints = ageAdjustmentBasisPoints(age) - discountBasisPoints;
  const cappedTotalBasisPoints = Math.max(
    totalBasisPoints,
    MAX_DISCOUNT_BASIS_POINTS,
  );

  const marketValueCents = roundDivision(
    baseValueCents * (HUNDRED_PERCENT_BASIS_POINTS + cappedTotalBasisPoints),
    HUNDRED_PERCENT_BASIS_POINTS,
  );

  return Math.max(marketValueCents, MIN_VALUE);
}

function calculatePlayerMarketValueCents(
  player: Pick<Player, 'baseValue' | 'condition' | 'agility' | 'age'>,
): number {
  return calculateMarketValueCents(
    Math.round(Number(player.baseValue) * 100),
    player.condition,
    player.agility,
    player.age,
  );
}

export function calculatePlayerDynamicValues(
  player: Player,
): PlayerWithDynamicValues {
  return {
    ...player,
    overall: calculateOverall(player.position, player),
    marketValue: calculatePlayerMarketValueCents(player) / 100,
  };
}
