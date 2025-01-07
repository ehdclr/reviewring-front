import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/apollo-client";
import { ApolloError, gql } from "@apollo/client";

const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      user {
        id
        email
        name
        nickname
        phone
        profileImage
      }
      success
      message
    }
  }
`;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ success: false, message: "ID는 필수 입니다." }, { status: 400 });
  }
  try{
    const { data } = await client.query({ query: GET_USER_QUERY, variables: { id } });

    if (!data.user.success) {
      return NextResponse.json({ success: false, message: data.user.message }, { status: 400 });
    }
    
    return NextResponse.json(
      { success: true, message: data.user.message, payload: data.user.user },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching user:", error);

    if (error instanceof ApolloError) {
      console.error("GraphQL 오류:", error.graphQLErrors);
      return NextResponse.json(
        { success: false, message: error.graphQLErrors[0]?.message || "GraphQL 요청 처리 중 오류 발생" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 });
  }
}