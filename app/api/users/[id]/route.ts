import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/apollo-client";
import { ApolloError, gql } from "@apollo/client";

// GraphQL 쿼리
const GET_USER_QUERY = gql`
  query GetUser($id: Float!) {
    getUser(id: $id) {
      user {
        id
        email
        name
        nickname
        phone
      }
      success
      message
    }
  }
`;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { success: false, message: "유효한 ID가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    // Apollo Client 요청
    const { data } = await client.query({
      query: GET_USER_QUERY,
      variables: { id: Number(id) }, // 문자열로 변환
      // context: {
      //   headers: {
      //     "Content-Type": "application/json", // Content-Type 명시
      //     Authorization: `Bearer ${request.cookies.get('token') || ''}`, // 인증 헤더 추가 (필요 시)
      //   },
      // },
    });

    console.log("GraphQL 응답:", data);

    // 응답 검증
    if (!data || !data.getUser) {
      return NextResponse.json(
        { success: false, message: "데이터를 가져올 수 없습니다." },
        { status: 400 }
      );
    }

    if (!data.getUser.success) {
      return NextResponse.json(
        { success: false, message: data.getUser.message },
        { status: 400 }
      );
    }

    // 성공 응답
    return NextResponse.json(
      { success: true, message: data.getUser.message, payload: data.getUser.user },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching user:", error);

    if (error instanceof ApolloError) {
      const errorMessage =
        error.graphQLErrors.length > 0
          ? error.graphQLErrors.map(err => err.message).join(", ")
          : error.networkError
          ? error.networkError.message
          : "GraphQL 요청 처리 중 오류 발생";

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "서버 오류" },
      { status: 500 }
    );
  }
}
