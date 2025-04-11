// const baseUrl = 'http://localhost:5000'
const baseUrl = 'https://e661-2605-59c0-5edc-ea10-f93d-b00c-77e6-ba51.ngrok-free.app'

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

export const updateData = async (num: string, nom: string, sold: string) => {
  try {
    const response = await fetch(`${baseUrl}/update-client/${num}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nom, sold }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating data:', error);
  }
};