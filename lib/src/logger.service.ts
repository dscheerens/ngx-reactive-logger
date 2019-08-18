import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject, SubscriptionLike } from 'rxjs';

import { LogAnnotations, MutableLogAnnotations } from './log-annotation.model';
import { LOG_ANNOTATOR, LogAnnotator } from './log-annotator.model';
import { ERROR } from './log-annotations';
import { AnnotatableLogEvent, LogEvent } from './log-event.model';
import { LogLevel } from './log-level.model';
import { LOG_OBSERVER, LogObserver } from './log-observer.model';

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

    public debug(message: string, annotations?: LogAnnotations): void {
        this.log(LogLevel.DEBUG, message, annotations);
    }

    public info(message: string, annotations?: LogAnnotations): void {
        this.log(LogLevel.INFO, message, annotations);
    }

    public warning(message: string): void;
    public warning(message: string, annotations: LogAnnotations): void;
    public warning(message: string, error: unknown): void;
    public warning(message: string, error: unknown, annotations: LogAnnotations): void;
    public warning(message: string, errorOrAnnotations?: unknown, annotations?: LogAnnotations): void {
        this.log(LogLevel.WARNING, message, getAnnotations(errorOrAnnotations, annotations));
    }

    public error(message: string): void;
    public error(message: string, annotations: LogAnnotations): void;
    public error(message: string, error: unknown): void;
    public error(message: string, error: unknown, annotations: LogAnnotations): void;
    public error(message: string, errorOrAnnotations?: unknown, annotations?: LogAnnotations): void {
        this.log(LogLevel.ERROR, message, getAnnotations(errorOrAnnotations, annotations));
    }

    public log(level: LogLevel, message: string, annotations: LogAnnotations = new MutableLogAnnotations()): void {

        const logEvent = this.logAnnotators.reduce(annotateLogEvent, {
            timestamp: Date.now(),
            level,
            message,
            annotations: annotations.asMutable()
        });

        this.publishLogEvent({
            ...logEvent,
            annotations: logEvent.annotations.asReadonly()
        });
    }

    public subscribe(logObserver: LogObserver): SubscriptionLike {
        return this.log$.subscribe((logEvent) => logObserver.processLogEvent(logEvent));
    }

    private publishLogEvent(logEvent: LogEvent): void {
        this.logPublisher.next(logEvent);
    }

}

function annotateLogEvent(logEvent: AnnotatableLogEvent, annotator: LogAnnotator): AnnotatableLogEvent {
    annotator.annotateLogEvent(logEvent);

    return logEvent;
}

function getAnnotations(errorOrAnnotations?: unknown, annotations?: LogAnnotations): MutableLogAnnotations {
    const result = (
        errorOrAnnotations instanceof LogAnnotations ? errorOrAnnotations.asMutable() :
        annotations instanceof LogAnnotations ? annotations.asMutable() :
        new MutableLogAnnotations()
    );

    if (errorOrAnnotations !== undefined && !(errorOrAnnotations instanceof LogAnnotations)) {
        result.set(ERROR, errorOrAnnotations);
    }

    return result;
}
