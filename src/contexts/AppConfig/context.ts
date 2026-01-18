import { createContext } from 'react';
import { AppConfigContextType } from './types';

export const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);
