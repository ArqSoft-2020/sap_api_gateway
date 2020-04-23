import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	usersMutations,
	usersQueries,
	usersTypeDef
} from './sap_profile_ms_api/profileTypeDef';

import {
	amigosMutations,
	amigosQueries,
	amigosTypeDef
} from './sap_amigos_ms_api/amigosTypeDef';

import amigosResolvers from './sap_amigos_ms_api/amigosresolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		usersTypeDef,amigosTypeDef
	],
	[
		usersQueries,amigosQueries
	],
	[
		usersMutations,amigosMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		usersResolvers, amigosResolvers
	)
});
