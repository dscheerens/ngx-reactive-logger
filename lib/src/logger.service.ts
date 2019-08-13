import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject, SubscriptionLike } from 'rxjs';

import { AnnotatableLogEvent, LogEvent } from './log-event.model';
import { LogLevel } from './log-level.model';
import { LogAnnotations, MutableLogAnnotations } from './log-annotation.model';
import { LOG_OBSERVER, LogObserver } from './log-observer.model';
import { LOG_ANNOTATOR, LogAnnotator } from './log-annotator.model';

@Injectable({ providedIn: 'root' })
export class LoggerService {

    public readonly log$: Observable<LogEvent>;

    private readonly logPublisher = new Subject<LogEvent>();

    private readonly logAnnotators: LogAnnotator[];

    constructor(
        @Optional() @Inject(LOG_OBSERVER) logObservers: LogObserver[] | null,
        @Optional() @Inject(LOG_ANNOTATOR) logAnnotators: LogAnnotator[] | null
    ) {
        this.log$ = this.logPublisher.asObservable();

        this.logAnnotators = logAnnotators || [];

        (logObservers || []).forEach((logObserver) => this.subscribe(logObserver));
    }

    public log(level: LogLevel, message: string): void {
        const logEvent =
            this.logAnnotators.length === 0
            ? createLogEvent(level, message, false)
            : convertToReadonlyLogEvent(this.logAnnotators.reduce(annotateLogEvent, createLogEvent(level, message, true)));

        this.publishLogEvent(logEvent);
    }

    public subscribe(logObserver: LogObserver): SubscriptionLike {
        return this.log$.subscribe((logEvent) => logObserver.processLogEvent(logEvent));
    }

    private publishLogEvent(logEvent: LogEvent): void {
        this.logPublisher.next(logEvent);
    }

}

function createLogEvent(level: LogLevel, message: string, annotatable: false): LogEvent;
function createLogEvent(level: LogLevel, message: string, annotatable: true): AnnotatableLogEvent;
function createLogEvent(level: LogLevel, message: string, annotatable: boolean): LogEvent {
    return {
        timestamp: Date.now(),
        level,
        message,
        annotations: annotatable ? new MutableLogAnnotations() : new LogAnnotations()
    };
}

function convertToReadonlyLogEvent(logEvent: AnnotatableLogEvent): LogEvent {
    return {
        ...logEvent,
        annotations: logEvent.annotations.asReadonly()
    };
}

function annotateLogEvent(logEvent: AnnotatableLogEvent, annotator: LogAnnotator): AnnotatableLogEvent {
    annotator.annotateLogEvent(logEvent);

    return logEvent;
}
