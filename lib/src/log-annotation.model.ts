
export class LogAnnotationSymbol<T> {
    // tslint:disable
    // @ts-ignore
    private readonly __type: T;
    // tslint:enable

    constructor(public readonly name: string) { }
}

export function logAnnotationSymbol<T>(name: string): LogAnnotationSymbol<T> {
    return new LogAnnotationSymbol<T>(name);
}

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

    public entries(): [LogAnnotationKey<unknown>, unknown][] {
        return Array.from(this.annotations.entries());
    }

    public asReadonly(): LogAnnotations {
        return this;
    }

    public asMutable(): MutableLogAnnotations {
        return new MutableLogAnnotations(this.entries());
    }

}

export class MutableLogAnnotations extends LogAnnotations {

    public set<T>(key: LogAnnotationKey<T>, value: T): MutableLogAnnotations {
        this.annotations.set(key, value);

        return this;
    }

    public asReadonly(): LogAnnotations {
        return new LogAnnotations(this.entries());
    }

    public asMutable(): MutableLogAnnotations {
        return this;
    }

}

export function annotate<T>(key: LogAnnotationKey<T>, value: T): MutableLogAnnotations {

    return new MutableLogAnnotations([[key, value]]);

}
