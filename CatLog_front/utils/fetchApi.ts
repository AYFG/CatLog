export const apiRequest = async (endpoint: string, method: string, body?: object) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
