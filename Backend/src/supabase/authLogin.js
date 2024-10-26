import {supabase} from '../config/supabaseClient';

 const authLogin = async (email,password) => {
    try{
        const { data, error} = await supabase.auth.signIn({
            email,
            password,
    });
    if (error) throw error;
    return data;
} catch(error) {
    console.error('Error logging in:', error);
    throw error;
}
};
module.exports = authLogin;