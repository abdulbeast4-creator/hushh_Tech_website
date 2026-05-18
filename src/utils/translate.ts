import en from '../locales/en.json';
import fr from '../locales/fr.json';
import zh from '../locales/zh.json';
import ar from '../locales/ar.json';

const localeDictionaries = { en, fr, zh, ar };

export const t = (key: string, currentLang: keyof typeof localeDictionaries): string => {
  const targetDict = localeDictionaries[currentLang] || localeDictionaries['en'];
  const trackingKeys = key.split('.');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentTraversal: any = targetDict;

  for (const token of trackingKeys) {
    if (currentTraversal && typeof currentTraversal === 'object' && token in currentTraversal) {
      currentTraversal = currentTraversal[token];
    } else {
      // Primary path missing — fall back to English dictionary
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let backupTraversal: any = localeDictionaries['en'];
      for (const fallbackToken of trackingKeys) {
        if (backupTraversal && typeof backupTraversal === 'object' && fallbackToken in backupTraversal) {
          backupTraversal = backupTraversal[fallbackToken];
        } else {
          return key;
        }
      }
      return backupTraversal || key;
    }
  }

  return typeof currentTraversal === 'string' ? currentTraversal : key;
};
