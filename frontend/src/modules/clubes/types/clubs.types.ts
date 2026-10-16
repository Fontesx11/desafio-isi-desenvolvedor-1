// Mesmo formato da resposta de GET /clubs
export type Club = {
  id: number;
  name: string;
  acronym: string;
  cash: number;
  squad_value: number;
  net_worth: number;
};

export type ClubSort = 'name' | 'net_worth_desc' | 'net_worth_asc';
