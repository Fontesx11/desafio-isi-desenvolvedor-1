import { PlayerCondition, PlayerPosition } from '../enums/players.enum.js';
import { calculateBaseValueCents, calculateMarketValueCents, calculateOverall } from './players.calculations.js';

const { APTO, MAL_CONDICIONADO, DOENTE } = PlayerCondition;

describe('calculateOverall', () => {
  it.each([
    [PlayerPosition.MEI, [68, 65, 80, 78, 52, 60], 73],
    [PlayerPosition.ATA, [78, 75, 73, 82, 48, 68], 76],
    [PlayerPosition.LAT, [72, 70, 78, 76, 70, 66], 72],
    [PlayerPosition.ZAG, [50, 90, 60, 40, 80, 75], 73],
    [PlayerPosition.GOL, [55, 30, 65, 40, 72, 68], 68],
  ])('%s %j -> %i', (position, [pace, shooting, passing, dribbling, defending, physical], expected) => {
    expect(
      calculateOverall(position, {
        pace,
        shooting,
        passing,
        dribbling,
        defending,
        physical,
      }),
    ).toBe(expected);
  });
});

describe('calculateBaseValueCents', () => {
  it.each([
    [75, 86, 25, 4000],
    [60, 70, 30, 1000],
    [61, 70, 30, 1200],
    [76, 80, 22, 4600],
    [85, 92, 27, 10000],
    [70, 84, 21, 3420],
    [70, 84, 22, 3000],
    [45, 90, 18, 363],
    [40, 66, 36, 100],
  ])('overall %i, potential %i, age %i -> %i cents', (overall, potential, age, expected) => {
    expect(calculateBaseValueCents(overall, potential, age)).toBe(expected);
  });
});

describe('calculateMarketValueCents', () => {
  it.each([
    [8200, APTO, 20, 25, 8200],
    [8200, APTO, 50, 19, 9020],
    [8200, MAL_CONDICIONADO, 50, 25, 6970],
    [8200, MAL_CONDICIONADO, 80, 21, 8405],
    [8200, MAL_CONDICIONADO, 30, 33, 5330],
    [8200, DOENTE, 90, 25, 6970],
    [8200, DOENTE, 30, 25, 4920],
    [8200, DOENTE, 10, 40, 4920],
    [950, MAL_CONDICIONADO, 85, 25, 879],
    [100, MAL_CONDICIONADO, 50, 35, 100],
  ])('base %i, %s, agility %i, age %i -> %i cents', (base, condition, agility, age, expected) => {
    expect(calculateMarketValueCents(base, condition, agility, age)).toBe(expected);
  });
});
