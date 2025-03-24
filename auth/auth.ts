import { Header, Gateway, APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";

const secretToken = secret('token');

interface AuthParams {
    authorization: Header<"Authorization">;
}

interface AuthData {
    userID: string;
}

export const myAuthHandler = authHandler(async (params: AuthParams): Promise<AuthData> => {
    const token = params.authorization.replace("Bearer", "");

    if (!token) {
        throw APIError.unauthenticated("no token provided");
    }

    const expectedToken = secretToken();

    // Compare the token from the request with the expected secret.
    if (token !== expectedToken) {
        throw APIError.unauthenticated("Invalid token");
    }

    return { userID: "userID123" };
});

// Define the API Gateway that will execute the auth handler:
export const myGateway = new Gateway({ authHandler: myAuthHandler })