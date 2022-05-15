export interface IPossibleMove {
    ifNotBlocked?: Array<string>;
    ifNotBlockedByOwn?: Array<string>;
    ifHasAnEnemy?: Array<string>;
    untilIsBlocked? : Array<Array<string>>;
    ifNotBlockedAndNoChess?: Array<string>;
    ifNotBlockedBefore?: Array<string>;
}