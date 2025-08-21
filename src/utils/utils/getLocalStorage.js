export const getLocalStorageUser = () => {
  try {
    let user = localStorage.getItem("user");
    return JSON.parse(user);
  } catch (error) {
    return;
  }
};

export const getLocalStorageCRUD = () => {
  try {
    let crud = localStorage.getItem("crud");
    return JSON.parse(crud);
  } catch (error) {
    return;
  }
};
