
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

type ViewModelResponseA {
    error: Boolean
    response: String
    amistad: ViewModelAmistad
}


`;

export const amigosQueries = `
    AmigosInfo(id: Int!): ViewModelResponseA!
`;

export const amigosMutations = `
    NewAmistad(model: ViewModelAmistadInput!): ViewModelResponseA!
    DeleteAmistad(Amigo1: Int!,Amigo2: Int!): ViewModelResponseA!

`;
