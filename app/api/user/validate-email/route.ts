import { NextRequest, NextResponse } from "next/server";
import { ApolloError, gql } from "@apollo/client";
import { client } from "@/lib/apollo-client";

// GraphQL Mutation 정의
const VALIDATE_EMAIL_MUTATION = gql`
  mutation ValidateEmail($email: String!) {
    validateEmail(email: $email) {
      success
      message
    }
  }
`;

// POST 요청 처리
export async function POST(req: NextRequest) {
  try {
    // 요청 데이터 추출
    const { email } = await req.json();

    // GraphQL Mutation 실행
    const { data } = await client.mutate({
      mutation: VALIDATE_EMAIL_MUTATION,
      variables: { email },
    });

    // 성공 여부 검증
    const response = data.validateEmail;
    if (!response.success) {
      return NextResponse.json(
        { success: false, message: response.message || "이미 사용 중인 이메일입니다." },
        { status: 400 }
      );
    }

    // 성공 응답 반환
    return NextResponse.json(
      { success: true, message: response.message },
      { status: 200 }
    );
  } catch (error) {
    // ApolloError 처리
    if (error instanceof ApolloError) {
      console.error("GraphQL 오류:", error.graphQLErrors);
      return NextResponse.json(
        {
          success: false,
          message:
            error.graphQLErrors[0]?.message || "GraphQL 요청 처리 중 오류 발생",
        },
        { status: 400 }
      );
    }
    // 기타 서버 에러 처리
    console.error("서버 오류:", error);
    return NextResponse.json(
      { success: false, message: "서버 내부 오류" },
      { status: 500 }
    );
  }
}
