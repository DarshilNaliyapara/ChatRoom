export const fetchCurrentUser = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/user/current", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userresponse = await response.json();
    return userresponse.data;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw error;
  }
};
