import { response } from "@/utils/response";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

export async function handler(event: APIGatewayProxyEventV2) {
  return response(200, {
    profile: {},
  });
}
