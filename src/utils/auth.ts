export const getAuth = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // ADMIN | TEACHER

  return {
    isAuth: !!token,
    role,
  };
};
