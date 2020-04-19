'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
	const parameters = {
		method,
		uri: encodeURI(url),
		body,
		json: true,
		resolveWithFullResponse: fullResponse
	};
	if (process.env.SHOW_URLS) {
		// eslint-disable-next-line
		console.log(url);
	}
	try {
		var generalRequestTest = await request(parameters);
		console.log(generalRequestTest);
		return generalRequestTest;
	} catch (err) {
		return err;
	}
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
function addParams(url, parameters) {
	let queryUrl = `${url}?`;
	for (let param in parameters) {
		// check object properties
		if (
			Object.prototype.hasOwnProperty.call(parameters, param) &&
			parameters[param]
		) {
			if (Array.isArray(parameters[param])) {
				queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	return queryUrl;
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
	const queryUrl = addParams(`${url}/${path}`, parameters);
	return generalRequest(queryUrl, 'GET');
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

/*
vmuser:  public Guid Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmedPassword { get; set; }
        public string Country { get; set; }
        public string Picture { get; set; }
        public byte[] ImageBytes { get; set; }
        public int TotalGames { get; set; }
        public int WonGames { get; set; }
        public int LostGames { get; set; }

    VMupload:
    public byte[] File { get; set; }
        public string FileName { get; set; }

    VMPAssword:
    public string Password { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmedNewPassword { get; set; }

    VMresponse:
        public bool Error { get; set; } Boolean
        public string Response { get; set; }
        public ViewModelUser User { get; set; }
        public object Token { get; set; }
        public string Uri { get; set; }
    VMLogin
     public string UserName { get; set; }
        public string Password { get; set; }
*/

const usersTypeDef = `
type ViewModelUser {
    id: String
    name: String
    lastName: String
    userName: String
    email: String
    password: String
    confirmedPassword: String
    country: String!
    picture: String!
    imageBytes: String
    totalGames: Int
    wonGames: Int
    lostGames: Int
}
input ViewModelUserInput {
    Id: String
    Name: String
    LastName: String
    UserName: String
    Email: String
    Password: String
    ConfirmedPassword: String
    Country: String
    Picture: String
    ImageBytes: String
    TotalGames: Int
    WonGames: Int
    LostGames: Int
} 

input ViewModelUploadFile {
    File: String!
    FileName: String!
}

input ViewModelPassword {
    Password: String!
    NewPassword: String!
    ConfirmedNewPassword: String!
}

type ViewModelResponse {
    error: Boolean
    response: String
    user: ViewModelUser
    token: String
    uri: String
}

input ViewModelLogin {
    Password: String!
    UserName: String!
}
`;

const usersQueries = `
    UserInfo(id: String!): ViewModelResponse!
    UploadFile(model: ViewModelUploadFile!): ViewModelResponse!
    Login(model: ViewModelLogin!): ViewModelResponse
    ValidateToken(token: String!): ViewModelResponse!
    RequestPasswordChange(email: String!): ViewModelResponse!
`;

const usersMutations = `
    Register(model: ViewModelUserInput!): ViewModelResponse!
    Verify(id: String!): ViewModelResponse!
    DeleteUser(id: String!): ViewModelResponse!
    EditUser(model: ViewModelUserInput!,id: String!): ViewModelResponse!
    ChangePasswordUser(model: ViewModelPassword!, id: String!): ViewModelResponse!
    ChangePassword(model: ViewModelPassword!,id: String!, token: String!): ViewModelResponse!
`;

const url = "localhost";
const port = "65380";
const entryPoint = "api/User/";

// export const url = process.env.SAP_PROFILE_MS_API_HOST
// export const port = process.env.SAP_PROFILE_MS_API_PORT
// export const entryPoint = process.env.SAP_PROFILE_MS_API_ENTRY

const URL = `http://${url}:${port}/${entryPoint}`;
console.log(URL);

    /*
export const usersQueries = `
    UserInfo:(id: String!): ViewModelUser!
    UploadFile(model: ViewModelUploadFile!): ViewModelResponse!
    Login(model: ViewModelLogin!): ViewModelResponse!
    ValidateToken(token: String!): ViewModelResponse!
    RequestPasswordChange(email: String!): ViewModelResponse!
`;

export const usersMutations = `
    Register(model: ViewModelUser!): ViewModelResponse!
    Verify(id: String!): ViewModelResponse!
    DeleteUser(id: String!): ViewModelResponse!
    EditUser(model: ViewModelUser!,id: String!): ViewModelResponse!
    ChangePasswordUser(model: ViewModelPassword!, id: String!): ViewModelResponse!
    ChangePassword(model: ViewModelPassword!,id: String!, token: String!): ViewModelResponse!
`;

*/


const resolvers = {
	Query: {
		UserInfo: (_, {id}) =>
			getRequest(`${URL}UserInfo/${id}`, ''),
        UploadFile: (_, { model }) =>
            generalRequest(`${URL}UploadFile`, 'POST', model),
        Login: (_, { model }) =>
            generalRequest(`${URL}Login`, 'POST', model),
        ValidateToken: (_, { token }) =>
            generalRequest(`${URL}ValidateToken/${token}`, 'GET'),
        RequestPasswordChange: (_, { email }) =>
            generalRequest(`${URL}RequestPasswordChange/${email}`, 'POST'),
    },

	Mutation: {
		Register: (_, { model }) =>
			generalRequest(`${URL}Register`, 'POST', model),
        Verify: (_, { id }) =>
			generalRequest(`${URL}Verify/${id}`, 'GET'),
        DeleteUser: (_, { id }) =>
            generalRequest(`${URL}DeleteUser/${id}`, 'DELETE'),
        EditUser: (_, { model, id }) =>
			generalRequest(`${URL}EditUser/${id}`, 'PUT', model),
        ChangePasswordUser: (_, { model, id }) =>
			generalRequest(`${URL}ChangePasswordUser/${id}`, 'PUT', model),
        ChangePassword: (_, { model, id, token }) =>
            generalRequest(`${URL}ChangePassword/${id}/${token}`, 'PUT', model),
        
	}
};

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		usersTypeDef
	],
	[
		usersQueries
	],
	[
		usersMutations
	]
);

// Generate the schema object from your types definition.
var grapQLSchema = graphqlTools.makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers
	)
});

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5001;

app.use(koaLogger());
app.use(koaCors());

// read token from header
app.use(async (ctx, next) => {
	if (ctx.header.authorization) {
		const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
		console.log(token);
		if (token && token[1]) {
			ctx.state.token = token[1];
		}
	}
	await next();
});

// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: grapQLSchema,
	context: { token: ctx.state.token },
	formatError: formatErr
}));

router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get(
	'/graphiql',
	apolloServerKoa.graphiqlKoa({
	  endpointURL: '/graphql', // a POST endpoint that GraphiQL will make the actual requests to
	}),
  );

app.use(router.routes());
app.use(router.allowedMethods());


// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
