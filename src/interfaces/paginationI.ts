
type OderValue = -1 | 1

export interface PaginationI<T>{
    page: number;
    limit: number;
    orderKey: T;
    orderValue :OderValue;
    search: string|null;
}

export interface PaginationDataI<T>{
    search: string|null;
    limit:number;
    total:number;
    count:number;
    currentPage:number;
    nextPage:number|null;
    previousPage:number|null;
    record: T;
}