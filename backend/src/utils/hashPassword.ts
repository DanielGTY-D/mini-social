import bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt)
}

const comparePassword = async (inputPass: string, hashedPass: string) => {
    const isCorrect = await bcrypt.compare(inputPass, hashedPass);
    return isCorrect;
}

export {
    hashPassword, 
    comparePassword,
}