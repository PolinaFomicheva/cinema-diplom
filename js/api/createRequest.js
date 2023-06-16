
async function postResponse(url = '', data = {}) {
  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
  });
  if (!response.ok) {
    throw Error;
  } else {
    return await response.json();
  }
}