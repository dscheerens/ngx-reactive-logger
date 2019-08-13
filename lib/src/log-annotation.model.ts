
// tslint:disable-next-line
// @ts-ignore
export class LogAnnotationSymbol<T> { }

export type LogAnnotationKey<T> = Function & { prototype: T } | LogAnnotationSymbol<T>; // tslint:disable-line:ban-types

export class LogAnnotations {

    protected readonly annotations: Map<LogAnnotationKey<unknown>, unknown>;

    constructor(initialEntries: [LogAnnotationKey<unknown>, unknown][] = []) {
        this.annotations = new Map(initialEntries);
    }

    public has(key: LogAnnotationKey<unknown>): boolean {
        return this.annotations.has(key);
    }

    public get<T>(key: LogAnnotationKey<T>): T | undefined {
        return this.annotations.get(key) as T | undefined;
    }

}

export class MutableLogAnnotations extends LogAnnotations {

    public set<T>(key: LogAnnotationKey<T>, value: T): MutableLogAnnotations {
        this.annotations.set(key, value);

        return this;
    }

    public asReadonly(): LogAnnotations {
        return new LogAnnotations(Array.from(this.annotations.entries()));
    }

}
