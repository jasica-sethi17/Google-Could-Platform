
import React from 'react';
import { Character } from '../types';
import { ClericIcon, DruidIcon, MageIcon, PaladinIcon, RangerIcon, RogueIcon, WarriorIcon, SpinnerIcon, PhotoIcon, ScrollIcon, HeartIcon, DropletIcon, FistIcon, BookmarkIcon } from './Icons';
import Button from './Button';

interface CharacterCardProps {
  character: Character;
  isGeneratingPortrait: boolean;
  onGeneratePortrait: () => void;
  portraitError: string | null;
  isGeneratingBackstory: boolean;
  onGenerateBackstory: () => void;
  backstoryError: string | null;
  onSaveToDeck: () => void;
  isSaved: boolean;
}

const classIconMap: { [key: string]: React.ReactNode } = {
  'Mage': <MageIcon className="w-16 h-16 text-violet-400" />,
  'Rogue': <RogueIcon className="w-16 h-16 text-stone-400" />,
  'Warrior': <WarriorIcon className="w-16 h-16 text-red-500" />,
  'Cleric': <ClericIcon className="w-16 h-16 text-yellow-400" />,
  'Ranger': <RangerIcon className="w-16 h-16 text-green-500" />,
  'Paladin': <PaladinIcon className="w-16 h-16 text-amber-400" />,
  'Druid': <DruidIcon className="w-16 h-16 text-emerald-500" />,
};

const StatDisplay: React.FC<{ icon: React.ReactNode; value: number; label: string }> = ({ icon, value, label }) => (
    <div className="flex flex-col items-center gap-1 text-center">
        <div className="p-2 bg-stone-900/50 rounded-full border border-stone-700">
            {icon}
        </div>
        <p className="text-xl font-bold text-stone-200">{value}</p>
        <p className="text-xs text-stone-400 uppercase tracking-wider">{label}</p>
    </div>
);

const CharacterCard: React.FC<CharacterCardProps> = ({ 
    character, 
    isGeneratingPortrait, 
    onGeneratePortrait, 
    portraitError,
    isGeneratingBackstory,
    onGenerateBackstory,
    backstoryError,
    onSaveToDeck,
    isSaved,
}) => {
    const icon = classIconMap[character.characterClass] || <div className="w-16 h-16 bg-gray-600 rounded-full" />;

  return (
    <div className="bg-stone-900/50 backdrop-blur-md border-4 border-amber-900/50 p-6 rounded-xl shadow-2xl shadow-stone-950/50 w-full max-w-sm animate-fade-in relative">
        <button 
            onClick={onSaveToDeck} 
            disabled={isSaved}
            className="absolute top-4 right-4 flex items-center gap-2 text-sm px-3 py-1 rounded-md transition-colors
                       bg-stone-700/80 border border-stone-600 text-amber-300
                       hover:bg-stone-700 hover:border-amber-500
                       disabled:bg-amber-800/50 disabled:border-amber-700/50 disabled:text-amber-300/70 disabled:cursor-not-allowed"
            aria-label={isSaved ? 'Character saved in deck' : 'Save character to deck'}
        >
            <BookmarkIcon className="w-4 h-4" />
            <span>{isSaved ? 'Saved' : 'Save to Deck'}</span>
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
            
            <div className="h-40 w-40 flex items-center justify-center mb-2">
                {isGeneratingPortrait ? (
                     <div className="flex flex-col items-center justify-center text-center gap-2">
                        <SpinnerIcon className="w-10 h-10 text-amber-400"/>
                        <p className="text-sm text-stone-400 animate-pulse">Sketching portrait...</p>
                    </div>
                ) : portraitError ? (
                    <div className="w-full h-full bg-red-900/20 border border-red-500/50 rounded-lg flex flex-col items-center justify-center text-center gap-2 p-4">
                        <p className="text-sm text-red-300">{portraitError}</p>
                   </div>
                ) : character.portrait ? (
                    <img src={character.portrait} alt={`Portrait of ${character.name}`} className="w-full h-full rounded-lg object-cover border-2 border-stone-600 shadow-lg" />
                ) : (
                    <div className="p-3 bg-stone-900/80 rounded-full border border-stone-700">
                        {icon}
                    </div>
                )}
            </div>

            <h2 className="text-3xl font-bold font-medieval tracking-wide text-amber-300 [text-shadow:0_0_10px_rgba(252,163,17,0.4)]">{character.name}</h2>
            <p className="text-xl text-amber-200 bg-stone-700/80 px-4 py-1 rounded-full border border-stone-600/50 -mt-2">{character.characterClass}</p>

            <div className="grid grid-cols-3 gap-4 w-full my-4 px-4">
                <StatDisplay icon={<HeartIcon className="w-6 h-6 text-red-400"/>} value={character.health} label="Health"/>
                <StatDisplay icon={<DropletIcon className="w-6 h-6 text-blue-400"/>} value={character.mana} label="Mana"/>
                <StatDisplay icon={<FistIcon className="w-6 h-6 text-orange-400"/>} value={character.strength} label="Strength"/>
            </div>
            
            <div className="h-16 mt-2 flex items-center justify-center text-center">
                {isGeneratingBackstory ? (
                    <p className="text-stone-400 italic animate-pulse">Weaving a tale...</p>

                ) : backstoryError ? (
                    <p className="text-sm text-red-300">{backstoryError}</p>
                ) : character.backstory ? (
                    <p className="text-stone-300 italic">"{character.backstory}"</p>
                ) : (
                    <p className="text-stone-500 text-sm">No backstory has been written yet.</p>
                )}
            </div>

            <div className="mt-4 w-full max-w-xs space-y-3">
                 <Button 
                    variant="secondary" 
                    onClick={onGeneratePortrait} 
                    disabled={isGeneratingPortrait || isGeneratingBackstory}
                >
                    {isGeneratingPortrait ? <SpinnerIcon className="w-5 h-5" /> : <PhotoIcon className="w-5 h-5" />}
                    <span>{character.portrait ? 'Regenerate Portrait' : 'Generate Portrait'}</span>
                </Button>
                <Button 
                    variant="secondary" 
                    onClick={onGenerateBackstory} 
                    disabled={isGeneratingPortrait || isGeneratingBackstory}
                >
                    {isGeneratingBackstory ? <SpinnerIcon className="w-5 h-5" /> : <ScrollIcon className="w-5 h-5" />}
                    <span>{character.backstory ? 'Regenerate Backstory' : 'Generate Backstory'}</span>
                </Button>
            </div>
        </div>
    </div>
  );
};

export default CharacterCard;