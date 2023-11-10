import { MatchingQuery, MongoQueryBuilder } from "./model/MongoQueryBuilder";

const queryBuilder = MongoQueryBuilder.query({parentKey: 'erp'})

//queryBuilder.or('standard', false)
//queryBuilder.and('$and', {$and: queryBuilder.internalAnd({'delivery': false}).$and})

queryBuilder.equals('change', '00,00')
queryBuilder.is('delivery', true)
queryBuilder.match('_id', '123456', 'i')

queryBuilder.and.equals('value', 1).equals('change', 10).buildLogicalQuery()
const query = queryBuilder.build()

console.log(JSON.stringify(query, undefined, 4))