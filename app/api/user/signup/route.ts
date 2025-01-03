import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/apollo-client";
import { ApolloError, gql } from "@apollo/client";

const CREATE_USER_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String!, $nickname: String!, $phone: String!) {
    signUp(signUpUserInput: {
      email: $email,
      password: $password,
      name: $name,
      nickname: $nickname,
      phone: $phone
    }) {   
      id
      email
      name
      nickname
      phone
    }
  }
`;

export async function POST(req: NextRequest) {
  const { email, password, name, nickname, phone } = await req.json();
  try {
    const response = await client.mutate({
      mutation: CREATE_USER_MUTATION,
      variables: { 
        email, 
        password, 
        name, 
        nickname, 
        phone
      },
    });
    
    if (response.data?.signUp) {
      return NextResponse.json({ 
        message: '회원가입이 완료되었습니다.',
        user: response.data.signUp 
      }, { status: 201 });
    } else {
      return NextResponse.json({ error: '회원가입 중 오류가 발생했습니다.' }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('회원가입 중 오류가 발생했습니다:', error);
    const errorMessage = (error as ApolloError).graphQLErrors?.[0]?.message || 
                        ((error as ApolloError).networkError as unknown as { result: { errors: { message: string }[] } })?.result?.errors?.[0]?.message ||
                        '회원가입 중 오류가 발생했습니다.';
    
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 400 });
  }
}