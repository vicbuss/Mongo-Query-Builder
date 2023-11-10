export type MongoRegex = {[key: string]: {$regex: string, $options: string}}

export type MongoQuery = Record<string, string | number | boolean | MongoQuery[] >

export type MatchingQuery = {$and: Array<MongoQuery>, $or: Array<MongoQuery>}

export type InnerMatchingQuery = Partial<MatchingQuery>

export type QueryOptions = {parentKey?: string}

export class MongoQueryBuilder {
    private constructor (private props: MatchingQuery , private queryOptions?: QueryOptions) {}

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

    inner(operator: keyof MatchingQuery): InnerQueryBuilder {
        return new InnerQueryBuilder(operator, this)
    }

    build(): MatchingQuery {
        return this.props
    }

    get options(): QueryOptions | undefined {
        return this.queryOptions
    }

}

class InnerQueryBuilder {
    private readonly childQuery: InnerMatchingQuery     

    constructor(private readonly operator: keyof MatchingQuery, private readonly motherQuery: MongoQueryBuilder) {
        this.childQuery = {
            $and: [{}],
            $or: [{}] 
        }
    }

    and(key: string, value: string | number | boolean| MongoQuery[]): InnerQueryBuilder {
        const query: MongoQuery = {}

        const queryOperatorRegex = /^\$[a-z]+$/

        const prefix = queryOperatorRegex.test(key) ? '' : this.motherQuery.options?.parentKey?.concat('.') || ''

        query[`${prefix}${key}`] = value;

        const $andIsEmpty = (Object.keys(this.childQuery.$and![0]).length === 0)

        if($andIsEmpty) {
            this.childQuery.$and![0] = query
        } else {
            this.childQuery.$and!.push(query)
        }
        return this
    }

    or(key: string, value: string | number | boolean| MongoQuery[]): InnerQueryBuilder {
        const query: MongoQuery = {}

        const queryOperatorRegex = /^\$[a-z]+$/

        const prefix = queryOperatorRegex.test(key) ? '' : this.motherQuery.options?.parentKey?.concat('.') || ''

        query[`${prefix}${key}`] = value

        const $orIsEmpty = (Object.keys(this.childQuery.$or![0]).length === 0)

        if($orIsEmpty) {
            this.childQuery.$or![0] = query
        } else {
            this.childQuery.$or!.push(query)
        }

        return this
    }
    innerBuild(): MongoQueryBuilder {
        
        const childQueryKey = Object.keys(this.childQuery)[0] as keyof InnerMatchingQuery
        const childQueryValues = this.childQuery[childQueryKey]

        const embeddedQuery = this.operator === '$and' 
            ? this.motherQuery.and(childQueryKey, childQueryValues!) 
            : this.motherQuery.or(childQueryKey, childQueryValues!)        

        return embeddedQuery
    }
}

