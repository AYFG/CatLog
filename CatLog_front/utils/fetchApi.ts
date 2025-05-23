import { getData, setData } from "./storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiRequest(endpoint: string, method: string, body?: object, token?: string) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      if (response.status === 401 && errorResponse.errorName === "TokenExpiredError") {
        const refreshTokenResponse = await refreshTokenRequest();
        if (refreshTokenResponse.accessToken) {
          return await apiRequest(endpoint, method, body, refreshTokenResponse.accessToken);
        }
      }
      throw errorResponse;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "TokenExpiredError"
    ) {
      const refreshTokenResponse = await refreshTokenRequest();
      if (refreshTokenResponse.accessToken) {
        return await apiRequest(endpoint, method, body, refreshTokenResponse.accessToken);
      }
    }
    throw error;
  }
}
export async function refreshTokenRequest() {
  try {
    const userData = await getData("userData");
    const refreshToken = userData.refreshToken;
    console.log("userData");
    console.log(userData);
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      if (response.status === 401 && errorResponse.errorName === "RefreshTokenExpired") {
        console.log(errorResponse);

        throw new Error(`${response.status}`);
      }
      throw new Error(`${response.status}`);
    }
    const data = await response.json();
    await setData("userData", { ...userData, accessToken: data.accessToken });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
