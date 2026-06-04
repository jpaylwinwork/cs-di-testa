export type PositionGroup = 'POR' | 'DEF' | 'MED' | 'DEL';
export type SpecificPosition = 'A' | 'CD' | 'CI' | 'LD' | 'LI' | 'MCC' | 'MCO' | 'EXT' | 'ED' | 'EI' | 'DC';
export type GoalType = 'Ataque rapido' | 'Balon parado' | 'Ataque organizado' | 'Recuperacion' | 'Penal';
export type MatchType = 'Liga' | 'Copa' | 'Amistoso';
export type Outcome = 'V' | 'E' | 'D';

export interface Player {
  id: number;
  name: string;
  position: PositionGroup;
  specificPosition: SpecificPosition;
  goals: number;
  assists: number;
  appearances: number;
  starts: number;
}

export interface Goal {
  matchId: string;
  date: string;
  rival: string;
  scorer: string;
  type: GoalType;
}

export interface Match {
  id: string;
  type: MatchType;
  date: string;
  rival: string;
  goalsFor: number;
  goalsAgainst: number;
  outcome: Outcome;
  lineup: string[];
  bench: string[];
}
