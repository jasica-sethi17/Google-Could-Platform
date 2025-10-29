
import React from 'react';
import { Character } from '../types';
import { ClericIcon, DruidIcon, MageIcon, PaladinIcon, RangerIcon, RogueIcon, WarriorIcon, TrashIcon } from './Icons';

interface DeckCardProps {
  character: Character;
  onRemove: (id: string) => void;
}

const classIconMap: { [key: string]: React.ReactNode } = {
  'Mage': <MageIcon className="w-8 h-8 text-violet-400" />,
  'Rogue': <RogueIcon className="w-8 h-8 text-stone-400" />,
  'Warrior': <WarriorIcon className="w-8 h-8 text-red-500" />,
  'Cleric': <ClericIcon className="w-8 h-8 text-yellow-400" />,
  'Ranger': <RangerIcon className="w-8 h-8 text-green-500" />,
  'Paladin': <PaladinIcon className="w-8 h-8 text-amber-400" />,
  'Druid': <DruidIcon className="w-8 h-8 text-emerald-500" />,
};

const DeckCard: React.FC<DeckCardProps> = ({ character, onRemove }) => {
    const icon = classIconMap[character.characterClass] || <div className="w-8 h-8 bg-gray-600 rounded-full" />;
    
  return (
    <div className="bg-stone-800/60 p-4 rounded-lg border border-stone-700 relative group transition-all duration-300 hover:border-amber-700 hover:scale-105">
      <button 
        onClick={() => onRemove(character.id)}
        className="absolute top-2 right-2 p-1 bg-red-900/70 rounded-full text-red-300 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-800"
        aria-label={`Remove ${character.name} from deck`}
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full mb-3 flex items-center justify-center bg-stone-900 border-2 border-stone-600">
            {character.portrait ? (
                <img src={character.portrait} alt={character.name} className="w-full h-full object-cover rounded-full" />
            ) : (
                icon
            )}
        </div>
        <h3 className="font-medieval text-lg text-amber-300 truncate w-full" title={character.name}>{character.name}</h3>
        <p className="text-sm text-stone-400">{character.characterClass}</p>
      </div>
    </div>
  );
};

export default DeckCard;