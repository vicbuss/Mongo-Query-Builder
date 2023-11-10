import { MatchingQuery, MongoQueryBuilder } from "./model/MongoQueryBuilder";

const queryBuilder = MongoQueryBuilder.query({parentKey: 'erp'})

//queryBuilder.or('standard', false)
//queryBuilder.and('$and', {$and: queryBuilder.internalAnd({'delivery': false}).$and})

const standardQuery = MongoQueryBuilder.query({parentKey: 'erp'}).and('staff', false).and('delivery', false).build()
const standardQueryKey = Object.keys(standardQuery)[0] as keyof MatchingQuery

queryBuilder.or(standardQueryKey, standardQuery[standardQueryKey]!)

const query = queryBuilder.build()

console.log(query)

console.log(JSON.stringify(query))