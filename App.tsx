
import React, { useState, useCallback } from 'react';
import { Character } from './types';
import { generateFantasyCharacter, generateCharacterPortrait, generateCharacterBackstory } from './services/geminiService';
import Button from './components/Button';
import CharacterCard from './components/CharacterCard';
import { GithubIcon, MagicWandIcon, SpinnerIcon } from './components/Icons';
import Deck from './components/Deck';

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deck, setDeck] = useState<Character[]>([]);

  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState<boolean>(false);
  const [portraitError, setPortraitError] = useState<string | null>(null);

  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState<boolean>(false);
  const [backstoryError, setBackstoryError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCharacter(null);
    setPortraitError(null);
    setBackstoryError(null);
    try {
      const newCharacterData = await generateFantasyCharacter();
      const newCharacterWithId = { ...newCharacterData, id: crypto.randomUUID() };
      setCharacter(newCharacterWithId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGeneratePortrait = useCallback(async () => {
    if (!character) return;

    setIsGeneratingPortrait(true);
    setPortraitError(null);
    
    const updateCharacterState = (updater: (prev: Character) => Character) => {
        setCharacter(prev => prev ? updater(prev) : null);
        setDeck(prevDeck => prevDeck.map(c => c.id === character.id ? updater(c) : c));
    };

    updateCharacterState(prev => ({ ...prev, portrait: undefined }));

    try {
      const portraitBase64 = await generateCharacterPortrait(character);
      const imageUrl = `data:image/png;base64,${portraitBase64}`;
      updateCharacterState(prev => ({ ...prev, portrait: imageUrl }));
    } catch (err) {
        setPortraitError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsGeneratingPortrait(false);
    }
  }, [character]);

  const handleGenerateBackstory = useCallback(async () => {
    if (!character) return;

    setIsGeneratingBackstory(true);
    setBackstoryError(null);

    const updateCharacterState = (updater: (prev: Character) => Character) => {
        setCharacter(prev => prev ? updater(prev) : null);
        setDeck(prevDeck => prevDeck.map(c => c.id === character.id ? updater(c) : c));
    };

    updateCharacterState(prev => ({ ...prev, backstory: undefined }));
    
    try {
        const backstory = await generateCharacterBackstory(character);
        updateCharacterState(prev => ({ ...prev, backstory }));
    } catch (err) {
        setBackstoryError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsGeneratingBackstory(false);
    }
  }, [character]);

  const handleSaveToDeck = useCallback(() => {
    if (!character) return;
    const isAlreadyInDeck = deck.some(c => c.id === character.id);
    if (!isAlreadyInDeck) {
        setDeck(prevDeck => [character, ...prevDeck]);
    }
  }, [character, deck]);

  const handleRemoveFromDeck = useCallback((id: string) => {
    setDeck(prevDeck => prevDeck.filter(c => c.id !== id));
  }, []);

  const isCurrentCharacterSaved = character ? deck.some(c => c.id === character.id) : false;

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 selection:bg-amber-500/30">
      <div className="w-full max-w-md mx-auto text-center">
        <header className="mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
                <MagicWandIcon className="w-12 h-12 text-amber-400" />
                <h1 className="text-4xl md:text-5xl font-bold font-medieval tracking-wider text-amber-300">
                    Fantasy Character Generator
                </h1>
            </div>
          <p className="text-stone-400">
            Click the button below to summon a new hero from the digital ether using the power of Gemini.
          </p>
        </header>

        <main className="mb-8 min-h-[580px] flex items-center justify-center">
          {isLoading && (
            <div className="flex flex-col items-center gap-4">
              <SpinnerIcon className="w-12 h-12 text-amber-400" />
              <p className="text-stone-400 animate-pulse">Summoning a hero...</p>
            </div>
          )}
          {error && <p className="text-red-400 bg-red-900/50 p-4 rounded-lg">Error: {error}</p>}
          {character && !isLoading && (
            <CharacterCard 
                character={character}
                isGeneratingPortrait={isGeneratingPortrait}
                portraitError={portraitError}
                onGeneratePortrait={handleGeneratePortrait}
                isGeneratingBackstory={isGeneratingBackstory}
                backstoryError={backstoryError}
                onGenerateBackstory={handleGenerateBackstory}
                onSaveToDeck={handleSaveToDeck}
                isSaved={isCurrentCharacterSaved}
            />
          )}
        </main>

        <footer>
          <Button onClick={handleGenerate} disabled={isLoading || isGeneratingPortrait || isGeneratingBackstory}>
            {isLoading ? 'Summoning...' : 'Generate New Character'}
          </Button>
        </footer>
      </div>
      
      {deck.length > 0 && <Deck deck={deck} onRemove={handleRemoveFromDeck} />}

      <a 
        href="https://github.com/google/genai-js" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-4 right-4 flex items-center gap-2 text-stone-500 hover:text-amber-400 transition-colors"
      >
        <GithubIcon className="w-5 h-5" />
        <span className="text-sm">Powered by Gemini</span>
      </a>
    </div>
  );
};

export default App;