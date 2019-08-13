import { InjectionToken } from '@angular/core';

import { AnnotatableLogEvent } from './log-event.model';

export const LOG_ANNOTATOR = new InjectionToken<LogAnnotator>('LOG_ANNOTATOR');

export interface LogAnnotator {

    annotateLogEvent(logEvent: AnnotatableLogEvent): void;

}
