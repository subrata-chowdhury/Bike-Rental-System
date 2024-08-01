function logOut() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

export default logOut
