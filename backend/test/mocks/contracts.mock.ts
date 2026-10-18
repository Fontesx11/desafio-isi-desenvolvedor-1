import { Contract } from '../../src/modules/contratos/entities/contract.entity.js';
import { ContractStatus } from '../../src/modules/contratos/enums/contracts.enum.js';

export const meiaLuaContractMock: Contract = {
  id: 1,
  playerId: 2,
  clubId: 1,
  purchaseValue: '37.00',
  loyaltyUntil: new Date('2027-03-02T10:15:00-03:00'),
  status: ContractStatus.ATIVO,
  startedAt: new Date('2026-11-02T10:15:00-03:00'),
  endedAt: null,
};
