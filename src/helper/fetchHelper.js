const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};
export const getData = async url => {
  try {
    const res = await fetch(url, {
      credentials: "include",
      headers
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const postData = async (url, data) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const deleteData = async url => {
  try {
    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};