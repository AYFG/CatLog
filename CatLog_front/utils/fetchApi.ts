export async function apiRequest(endpoint: string, method: string, body?: object, token?: string) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
