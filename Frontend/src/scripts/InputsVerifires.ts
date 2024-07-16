const verifyFieldsForLogIn = (email: string, password: string): boolean => {
    if (email === '' || password === '') {
        return false;
    }
    return true;
}

const verifyFieldsForRegister = (email: string, password: string, confirmPassword: string, firstName: string, lastName: string): boolean => {
    if (firstName === '' || lastName === '' || email === '' || password === '' || confirmPassword === '') {
        return false;
    }
    return true;
}

export { verifyFieldsForLogIn, verifyFieldsForRegister }