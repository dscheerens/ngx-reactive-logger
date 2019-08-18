import { PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';

import { LogAnnotator } from './log-annotator.model';
import { AnnotatableLogEvent } from './log-event.model';
import { URL } from './log-annotations';

@Injectable()
export class UrlLogAnnotator implements LogAnnotator {

    constructor(private readonly platformLocation: PlatformLocation) { }

    public annotateLogEvent(logEvent: AnnotatableLogEvent): void {
        logEvent.annotations.set(URL, this.platformLocation.href);
    }

}
