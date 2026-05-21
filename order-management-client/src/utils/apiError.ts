export const handleApiResponse = async (response: Response, defaultMessage: string) => {
  if (!response.ok) {
    let errorMessage = defaultMessage;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // Failed to parse JSON, use default message
    }
    throw new Error(errorMessage);
  }
  return response.json();
};
