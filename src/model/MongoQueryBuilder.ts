export type MongoQuery = Record<string, string | number | boolean | MongoQuery [] >
export type MatchingQuery = {$and?: Array<MongoQuery>, $or?: Array<MongoQuery>}
export type QueryOptions = {parentKey?: string}

export class MongoQueryBuilder {
    private constructor (private props: MatchingQuery , private options?: QueryOptions) {}

    static query(options?: QueryOptions) {
        const props = {
            $and: [{}],
            $or: [{}]
        }
        return new MongoQueryBuilder(props, options)
    }

    and(key: string, value: string | number | boolean| MongoQuery[]): MongoQueryBuilder {
        const query: MongoQuery = {}

        const queryOperatorRegex = /^\$[a-z]+$/

        const prefix = queryOperatorRegex.test(key) ? '' : this.options?.parentKey?.concat('.') || ''

        query[`${prefix}${key}`] = value;


        const $andIsEmpty = (Object.keys(this.props.$and![0]).length === 0)

        if($andIsEmpty) {
            this.props.$and![0] = query
        } else {
            this.props.$and!.push(query)
        }
        return this
    }

    or(key: string, value: string | number | boolean| MongoQuery[]): MongoQueryBuilder {
        const query: MongoQuery = {}

        const queryOperatorRegex = /^\$[a-z]+$/

        const prefix = queryOperatorRegex.test(key) ? '' : this.options?.parentKey?.concat('.') || ''

        query[`${prefix}${key}`] = value

        const $orIsEmpty = (Object.keys(this.props.$or![0]).length === 0)

        if($orIsEmpty) {
            this.props.$or![0] = query
        } else {
            this.props.$or!.push(query)
        }

        return this
    }

    build(): MatchingQuery {
        return this.props
    }

}

