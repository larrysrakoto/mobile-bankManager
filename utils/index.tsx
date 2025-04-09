// const baseUrl = 'http://localhost:5000'
const baseUrl = 'https://8e63-2605-59c0-5edc-ea10-7028-1a53-39e3-8a53.ngrok-free.app'

export const getData = async () => {
  try {
    const response = await fetch(`${baseUrl}/client`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


export const saveData = async (num: string, nom: string, sold: string) => {
  try {
    const response = await fetch(`${baseUrl}/save-client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ num, nom, sold }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export const deleteData = async (num: string) => {
  try {
    const response = await fetch(`${baseUrl}/client/${num}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ num }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}