import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;
console.log(URL);

const resolvers = {
	Query: {
		getAllHistorials: () =>
			getRequest(`${URL}historial`, ''),
        getHistorialsById: (_, { id }) =>
            getRequest(`${URL}historial/${id}`, ''),
    },

	Mutation: {
		updateCanvas: (_, { model, id }) =>
			generalRequest(`${URL}update/${id}`, 'POST', model),
        createCanvas: () =>
			generalRequest(`${URL}update`, 'POST', model),
        DeleteCanvas: (_, { id }) =>
            generalRequest(`${URL}update/${id}`, 'DELETE'),
        
	}
};

export default resolvers;
