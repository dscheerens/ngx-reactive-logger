import { LogLevel } from './log-level.model';
import { LogAnnotations, MutableLogAnnotations } from './log-annotation.model';

export interface LogEvent {
    readonly timestamp: number;
    readonly level: LogLevel;
    readonly message: string;
    readonly annotations: LogAnnotations;
}

export interface AnnotatableLogEvent extends LogEvent {
    readonly annotations: MutableLogAnnotations;
}
