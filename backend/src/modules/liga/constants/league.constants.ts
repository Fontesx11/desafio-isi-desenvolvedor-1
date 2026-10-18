import { ClubFormation } from '../../clubes/enums/clubs.enum.js';
import { FormationSectors } from '../interfaces/lineup.interface.js';

export const FORMATION_SECTORS: Record<ClubFormation, FormationSectors> = {
  [ClubFormation.THREE_ONE]: { defense: 3, midfield: 0, attack: 1 },
  [ClubFormation.TWO_TWO]: { defense: 2, midfield: 0, attack: 2 },
  [ClubFormation.TWO_ONE_ONE]: { defense: 2, midfield: 1, attack: 1 },
  [ClubFormation.ONE_TWO_ONE]: { defense: 1, midfield: 2, attack: 1 },
};
