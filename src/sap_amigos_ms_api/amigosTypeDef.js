
export const amigosTypeDef = `
type ViewModelAmistad {
    id: Int
    Amigo1: Int
    Amigo2: Int
}
input ViewModelAmistadInput {
    Amigo1: Int
    Amigo2: Int
}

type ViewModelResponse {
    error: Boolean
    response: String
    amistad: ViewModelAmistad
}


`;

export const amigosQueries = `
    AmigosInfo(id: Int!): ViewModelResponse!
`;

export const amigosMutations = `
    NewAmistad(model: ViewModelAmistadInput!): ViewModelResponse!
    DeleteAmistad(Amigo1: Int!,Amigo2: Int!): ViewModelResponse!

`;
