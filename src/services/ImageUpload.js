export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const response = await fetch('/api/upload/', {
        method: 'POST',
        headers: {
          accept: 'application/json',
        },
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data.imageUrl; // Assuming the API returns { imagePath: 'path_to_image' }
      } else {
        throw new Error('Failed to upload the image.');
      }
    } catch (error) {
      console.error('Error during the upload:', error);
      throw error; // Re-throw the error to handle it in the calling component
    }
  };
  