import { InjectionToken } from '@angular/core';

import { LogEvent } from './log-event.model';

export const LOG_OBSERVER = new InjectionToken<LogObserver>('LOG_OBSERVER');

export interface LogObserver {
    processLogEvent(logEvent: LogEvent): void;
}
