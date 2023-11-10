import { MongoQueryBuilder } from "./model/MongoQueryBuilder";

const mongoQuery = MongoQueryBuilder.query({parentKey: 'erp'})

const andQuery = MongoQueryBuilder.query(mongoQuery.options)

const orQuery = MongoQueryBuilder.query(mongoQuery.options)

orQuery.is('delivery', true)
orQuery.is('staff', true)
orQuery.is('item.canceled', true)

const standardQuery = MongoQueryBuilder.query(mongoQuery.options)
    .is('delivery', false)
    .is('staff', false)
    .match('_id', '^\\d{8}(?!_cancelamentos)$', 'i')

orQuery.and(standardQuery)

mongoQuery.and(andQuery).or(orQuery)

const query = mongoQuery.build()

console.log(JSON.stringify(query, undefined, 4))