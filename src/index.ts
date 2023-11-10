import { MatchingQuery, MongoQueryBuilder } from "./model/MongoQueryBuilder";

const queryBuilder = MongoQueryBuilder.query({parentKey: 'erp'})

//queryBuilder.or('standard', false)
//queryBuilder.and('$and', {$and: queryBuilder.internalAnd({'delivery': false}).$and})

queryBuilder.or
    .equals('change', '00,00')
    .is('delivery', true)
    .match('_id', '123456', 'i')
    .buildLogicalQuery()

const query = queryBuilder.build()

console.log(JSON.stringify(query, undefined, 4))