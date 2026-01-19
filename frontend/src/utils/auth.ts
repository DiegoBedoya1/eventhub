export const isAdmin = () => {
    return localStorage.getItem('is_admin') === '1';
};