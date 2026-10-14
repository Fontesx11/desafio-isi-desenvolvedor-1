export enum PlayerPosition {
  GOL = 'GOL',
  ZAG = 'ZAG',
  LAT = 'LAT',
  MEI = 'MEI',
  ATA = 'ATA',
}

export enum PlayerCondition {
  APTO = 'APTO',
  MAL_CONDICIONADO = 'MAL_CONDICIONADO',
  DOENTE = 'DOENTE',
}

export enum PlayerSort {
  NAME = 'name',
  VALUE_ASC = 'value_asc',
  VALUE_DESC = 'value_desc',
  AGE_ASC = 'age_asc',
  AGE_DESC = 'age_desc',
  POSITION = 'position',
}

export const POSITION_ORDER: Record<PlayerPosition, number> = {
  [PlayerPosition.GOL]: 1,
  [PlayerPosition.ZAG]: 2,
  [PlayerPosition.LAT]: 3,
  [PlayerPosition.MEI]: 4,
  [PlayerPosition.ATA]: 5,
};
