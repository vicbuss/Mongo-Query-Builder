export interface IQueryBuilder<T> {

    build : () => T
    equals: (field: string, value: string | number) => IQueryBuilder<T>
    is: (field: string, value: boolean) => IQueryBuilder<T>

}