import { Field, ObjectType, InputType } from 'type-graphql';

@ObjectType()
export class User {
    @Field()
    id!: number;

    @Field()
    name!: number;

    @Field()
    email!: number;
}

@InputType()
export class UserInput {
    @Field()
    name!: string;

    @Field()
    email!: string;
}