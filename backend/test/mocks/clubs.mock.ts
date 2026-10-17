import { Club } from '../../src/modules/clubes/entities/club.entity.js';

export function buildClub(overrides: Partial<Club> = {}): Club {
  return Object.assign(
    new Club(),
    {
      id: 1,
      name: 'Águias FC',
      acronym: 'AGU',
      cash: '300.00',
      players: [],
    },
    overrides,
  );
}
