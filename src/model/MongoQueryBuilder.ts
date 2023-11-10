export type MongoRegex = {[key: string]: {$regex: string, $options: string}}

export type MongoQuery = Record<string, string | number | boolean | object | Array<MongoQuery>>

export type MatchingQuery = Record<'$and' | '$or', Array<MongoQuery>>

export type InnerMatchingQuery = Partial<MatchingQuery>

export type QueryOptions = {parentKey?: string}

export class MongoQueryBuilder {
    private constructor (private props: MongoQuery , private queryOptions?: QueryOptions) {}

    static query(options?: QueryOptions) {
        const props: MongoQuery = {}
        return new MongoQueryBuilder(props, options)
    }

    equals(key: string, value: string | number): MongoQueryBuilder {
        const queryOperatorRegex = /(^\$[a-z]+$)|(^_id$)/

        const prefix = queryOperatorRegex.test(key) ? '' : this.options?.parentKey?.concat('.') || ''

        const queryKey = `${prefix}${key}`

        this.props[queryKey] = value

        return this

    }

    is(key: string, value: boolean): MongoQueryBuilder {
        const queryOperatorRegex = /(^\$[a-z]+$)|(^_id$)/

        const prefix = queryOperatorRegex.test(key) ? '' : this.options?.parentKey?.concat('.') || ''

        const queryKey = `${prefix}${key}`

        this.props[queryKey] = value

        return this
    }

    match(key: string, regex: string, options: string): MongoQueryBuilder {
        const queryOperatorRegex = /(^\$[a-z]+$)|(^_id$)/

        const prefix = queryOperatorRegex.test(key) ? '' : this.options?.parentKey?.concat('.') || ''

        const queryKey = `${prefix}${key}`
        
        this.props[queryKey] = {$regex: regex, $options: options}

        return this

    }

    insertQuery(query: MongoQuery): MongoQueryBuilder {
        const key = Object.keys(query)[0]
        const value = query[key]

        this.props[key] = value

        return this
    }

    get and(): LogicalQueryBuilder {
        return LogicalQueryBuilder.aLogicalQuery("$and", this)
    }

    get or(): LogicalQueryBuilder {
        return LogicalQueryBuilder.aLogicalQuery("$or", this)
    }


    build(): MongoQuery {
        return this.props
    }

    get options(): QueryOptions | undefined {
        return this.queryOptions
    }

}

class LogicalQueryBuilder {

    private constructor(private readonly operator: keyof MatchingQuery, private readonly motherQuery: MongoQueryBuilder, private readonly logicalQuery: MatchingQuery) {}

    static aLogicalQuery(operator: keyof MatchingQuery, motherQuery: MongoQueryBuilder): LogicalQueryBuilder {
        const logicalQuery: MatchingQuery = Object.create({})
        logicalQuery[operator] = [{}]
        return new LogicalQueryBuilder(operator, motherQuery, logicalQuery)
    }

    equals(key: string, value: string | number): LogicalQueryBuilder {
        const query: MongoQuery = {}

        const queryOperatorRegex = /(^\$[a-z]+$)|(^_id$)/

        const prefix = queryOperatorRegex.test(key) ? '' : this.motherQuery.options?.parentKey?.concat('.') || ''

        const queryKey = `${prefix}${key}`

        query[queryKey] = value

        const logicalQueryIsEmpty = (Object.keys(this.logicalQuery[this.operator][0]).length === 0)

        if(logicalQueryIsEmpty) {
            this.logicalQuery[this.operator][0] = query
        } else {
            this.logicalQuery[this.operator].push(query)
        }
        return this
    }

    is(key: string, value: boolean): LogicalQueryBuilder {
        const query: MongoQuery = {}

        const queryOperatorRegex = /(^\$[a-z]+$)|(^_id$)/

        const prefix = queryOperatorRegex.test(key) ? '' : this.motherQuery.options?.parentKey?.concat('.') || ''

        const queryKey = `${prefix}${key}`

        query[queryKey] = value

        const logicalQueryIsEmpty = (Object.keys(this.logicalQuery[this.operator][0]).length === 0)

        if(logicalQueryIsEmpty) {
            this.logicalQuery[this.operator][0] = query
        } else {
            this.logicalQuery[this.operator].push(query)
        }
        return this
    }

    match(key: string, regex: string, options: string): LogicalQueryBuilder {
        const query: MongoQuery = {}

        const queryOperatorRegex = /(^\$[a-z]+$)|(^_id$)/

        const prefix = queryOperatorRegex.test(key) ? '' : this.motherQuery.options?.parentKey?.concat('.') || ''

        const queryKey = `${prefix}${key}`
        
        query[queryKey] = {$regex: regex, $options: options}

        const logicalQueryIsEmpty = (Object.keys(this.logicalQuery[this.operator][0]).length === 0)

        if(logicalQueryIsEmpty) {
            this.logicalQuery[this.operator][0] = query
        } else {
            this.logicalQuery[this.operator].push(query)
        }
        return this

    }

    buildLogicalQuery(): MongoQueryBuilder {
        this.motherQuery.insertQuery(this.logicalQuery)

        return this.motherQuery
    }

}

