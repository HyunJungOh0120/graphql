const graphql = require('graphql');

const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = graphql;

const users = [
  { id: 1, firstName: 'Aaron', age: 43, companyId: 1 },
  { id: 2, firstName: 'Lucy', age: 27, companyId: 2 },
  { id: 3, firstName: 'Agnes', age: 29, companyId: 3 },
  { id: 4, firstName: 'Luca', age: 21, companyId: 3 },
  { id: 5, firstName: 'Bella', age: 21, companyId: 4 },
  { id: 6, firstName: 'Brodie', age: 21, companyId: 4 },
];
const companies = [
  { id: 1, name: 'Apple', description: 'iphone' },
  { id: 2, name: 'Google', description: 'search' },
  { id: 3, name: 'Cloudflare', description: 'network' },
  { id: 4, name: 'OFS', description: 'international school' },
  { id: 5, name: 'Samsung', description: 'electronics' },
];

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  description: 'This represents companies',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },

    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return _.filter(users, (user) => {
          return user.companyId == parentValue.id;
        });
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents users',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLNonNull(GraphQLInt) },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return _.find(companies, { id: parentValue.companyId });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root Query',
  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: GraphQLNonNull(GraphQLInt) } },
      resolve(parentValue, args) {
        return _.find(users, { id: args.id });
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLNonNull(GraphQLInt) } },
      resolve(parentValue, args) {
        return _.find(companies, { id: args.id });
      },
    },
    companies: {
      type: new GraphQLList(CompanyType),
      resolve(parentValue, args) {
        return _.pullAll(companies);
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
