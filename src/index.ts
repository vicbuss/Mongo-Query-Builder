import { MatchingQuery, MongoQueryBuilder } from "./model/MongoQueryBuilder";

const queryBuilder = MongoQueryBuilder.query({parentKey: 'erp'})

//queryBuilder.or('standard', false)
//queryBuilder.and('$and', {$and: queryBuilder.internalAnd({'delivery': false}).$and})

queryBuilder.or('delivery', true)
queryBuilder.or('staff', true)
queryBuilder.or('item.canceled', true)

queryBuilder.inner('$or')
    .and('delivery', false)
    .and('staff', false)
    .innerBuild()

const query = queryBuilder.build()

console.log(JSON.stringify(query, undefined, 4))