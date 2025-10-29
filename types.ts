
export interface Character {
  id: string;
  name: string;
  characterClass: string;
  health: number;
  mana: number;
  strength: number;
  portrait?: string;
  backstory?: string;
}