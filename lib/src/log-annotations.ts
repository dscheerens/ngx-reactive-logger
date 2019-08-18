import { logAnnotationSymbol } from './log-annotation.model';

export const ERROR = logAnnotationSymbol<unknown>('ERROR');

export const URL = logAnnotationSymbol<string>('URL');
