export type MongoQuery = Record<string, string | number | boolean | object | Array<MongoQuery>>

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

    and(query: MongoQueryBuilder): MongoQueryBuilder {
        const queryArray: Array<MongoQuery> = [{}]

        for(const key in query.props) {
            const queryArrayIsEmpty = (Object.keys(queryArray[0]).length) === 0

            const insertedQuery: MongoQuery = {}
            insertedQuery[key] = query.props[key]

            queryArrayIsEmpty ? queryArray[0] = insertedQuery : queryArray.push(insertedQuery)
        }

        this.props['$and'] = queryArray

        return this
    }

    or(query: MongoQueryBuilder): MongoQueryBuilder {
        const queryArray: Array<MongoQuery> = [{}]

        for(const key in query.props) {
            const queryArrayIsEmpty = (Object.keys(queryArray[0]).length) === 0

            const insertedQuery: MongoQuery = {}
            insertedQuery[key] = query.props[key]

            queryArrayIsEmpty ? queryArray[0] = insertedQuery : queryArray.push(insertedQuery)
        }

        this.props['$or'] = queryArray

        return this
    }

    build(): MongoQuery {
        return this.props
    }

    get options(): QueryOptions | undefined {
        return this.queryOptions
    }

}