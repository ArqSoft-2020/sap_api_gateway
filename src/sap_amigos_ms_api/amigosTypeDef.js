
export const amigosTypeDef = `

input ViewModelAmistadInput {
    amigo1: String
    amigo2: String
}


type ViewModelResponseA {
    success: Boolean
}

type ViewModelResponseD {
  deleted: String,
  deleted2: String,
  success: Boolean
}

type ViewModelResponseQ {
  amigos1ra:[ViewModelResponseSubQ1]
  amigos2da:[ViewModelResponseSubQ2]
  success: Boolean
}

type ViewModelResponseSubQ1 {
  amigo1: String
}

type ViewModelResponseSubQ2 {
  amigo2: String
}


`;

export const amigosQueries = `
    AmigosInfo(id: String!): ViewModelResponseQ!
`;

export const amigosMutations = `
    NewAmistad(model: ViewModelAmistadInput!): ViewModelResponseA!
    DeleteAmistad(amigo1: String!,amigo2: String!): ViewModelResponseD!

`;
