import { NextRequest, NextResponse } from "next/server";
import { ApolloError, gql } from "@apollo/client";
import { client } from "@/lib/apollo-client";

// GraphQL Mutation 정의
const VALIDATE_NICKNAME_MUTATION = gql`
  mutation ValidateNickname($nickname: String!) {
    validateNickname(nickname: $nickname) {
      success
      message
    }
    }
`;

// POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    const { nickname } = await req.json();
    if (!nickname) {
      return NextResponse.json(
        { success: false, message: "닉네임이 필요합니다." },
        { status: 400 }
      );
    }

    const { data } = await client.mutate({
      mutation: VALIDATE_NICKNAME_MUTATION,
      variables: { nickname },
    });

    const response = data.validateNickname;
    if (!response.success) {
      return NextResponse.json(
        { success: false, message: response.message || "이미 사용 중인 닉네임입니다." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: response.message },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validating nickname:", error);

    if (error instanceof ApolloError) {
      console.error("GraphQL 오류:", error.graphQLErrors);
      return NextResponse.json(
        { success: false, message: error.graphQLErrors[0]?.message || "GraphQL 요청 처리 중 오류 발생" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, message: "서버 내부 오류" }, { status: 500 });
  }
}
