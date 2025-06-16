import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../../utils/constants.mjs";

//failed to serialize the user to the session
passport.serializeUser((user, done) => {
    console.log('Serializing user:', user); // log the user object being serialized
    done(null, user.id); // store the user id in the session
});

//stackoverflow.com/questions/40031866/passport-local-failed-to-serialize-the-user-to-the-session


//sending another request calls the deserializeUser function
passport.deserializeUser((id, done) => {
    //use the id for the session store
    // we can use name or anything to serialize the user
    // id is something that is unique and never gonna change so it is used
    // logs to see how this all works
    console.log(`Inside Deserializer`);
    console.log(`Deserializing user with id: ${id}`); // log the user id being deserialized



    // take that id and unpack the user object and what happens is it takes the user object from the session store
    // search for the user in the mockUsers array or database
try{
    const findUser = mockUsers.find(user => user.id === id);
    if(!findUser) throw new Error('User not found');
    done(null, findUser); // return the user object
}catch(err){
    done(err, null); // if there is an error, return it
}

});



passport.use(new Strategy({
    usernameField: 'name',
    passwordField: 'password'
}, (name, password, done) => {
    console.log(`name: ${name}, password: ${password}`); // just to see what is happening under the hood
    try{
        const findUser = mockUsers.find(user => user.name === name);
        if (!findUser) throw new Error('User not found');
        if (findUser.password !== password) throw new Error('Invalid password');
        done(null, findUser);
        //done(err,user) is a callback function that is called when the authentication is complete.
    }
    catch (err) {
        done(err, null);
    }
}));

// we have register this
export default passport; // export the passport instance to be used in the main app file
