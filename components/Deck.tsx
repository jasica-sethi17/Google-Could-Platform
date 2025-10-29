
import React from 'react';
import { Character } from '../types';
import DeckCard from './DeckCard';

interface DeckProps {
  deck: Character[];
  onRemove: (id: string) => void;
}

const Deck: React.FC<DeckProps> = ({ deck, onRemove }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-12 animate-fade-in">
      <h2 className="text-3xl font-medieval text-amber-300 text-center mb-6 [text-shadow:0_0_8px_rgba(252,163,17,0.3)]">
        My Deck
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {deck.map(character => (
          <DeckCard key={character.id} character={character} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};

export default Deck;