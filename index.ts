import { buildSchema } from 'graphql';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';

// Data hårdkodad in vår kod istället för att hämta från en databas
//............//
export let santasList = [
    { id: 1, name: 'Vivvi', wish: "Doll", nice: true},
    { id: 2, name: 'Lollo', wish: "Robot", nice: false},
    { id: 3, name: 'Bobbo', wish: "Dress", nice: true}
];

export let wishList = [
    {id: 100, wishes: ['Doll', 'Car']},
    {id: 101, wishes: ['Puppy', 'Book']},
    {id: 102, wishes: ['Shoes', 'Lego']},
]

// Schema
//--------------------//
export const schema = buildSchema(`
    type Query {
        getChild(id: Int!): Child
        getChildren: [Child]
    }

    type Child {
        id: Int!
        name: String!
        wish: String!
        nice: Boolean!
    }

    input ChildInput {
        name: String!
        wish: String!
        nice: Boolean!
    }

    type Mutation {
        createChild(input: ChildInput): Child
        updateChild(id: Int!, input: ChildInput): Child
        deleteChild(id: Int!): String
    }
`);
//--------------------//

type Child = {
    id: number;
    name: string;
    wish: string;
    nice: boolean;
}
type ChildInput = 
    Pick<Child, 'name' | 'wish' | 'nice'>

// Resolver

const getChild = (args: { id: number }): Child | undefined => 
        santasList.find(chosenChild => chosenChild.id === args.id)

const getChildren = (): Child[] => santasList;

const createChild = (args: { input: ChildInput}): Child => {
    const newChild = {
        id: santasList.length + 1,
        ...args.input,
    }
    santasList.push(newChild);
    return newChild;
}

const deleteChild = (args: {id: number}) => {
    santasList = santasList.filter((chosenChild) => chosenChild.id !== args.id)
    return `The user with id ${args.id} is deleted`;
}

const updateChild = (args: { user: Child  }): Child => {
    const index = santasList.findIndex(chosenChild => chosenChild.id === args.user.id);
    const targetChild = santasList[index];

    if (targetChild) santasList[index] = args.user 

    return targetChild;
}

const root = {
    getChild,
    getChildren,
    createChild,
    updateChild,
    deleteChild,
}
//------------------//

// Server

const app = express();

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
)

const PORT = 3000;

app.listen(PORT)
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);