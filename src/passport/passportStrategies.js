import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import UsersManager from '../persistencia/dao/managers/userManagerMongo.js';
import { compareData } from '../utils.js';
import config from '../config.js'

const um = new UsersManager()

passport.use('login', new LocalStrategy(
    async function (username, password, done) {
        try {
            const userDB = await um.findUser(username)
            if (!userDB) {
                return done(null, false)
            }
            const passwordIncorrect = await compareData(password, userDB.password)
            if (!passwordIncorrect) {
                return done(null, false);
            }
            return done(null, userDB);
        } catch (error) {
            done(error)
        }
    }
))

passport.use(new GithubStrategy({
    clientID: config.github_client_id,
    clientSecret:  config.github_client_secret,
    callbackURL: config.github_url_callback
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        const userDB = await um.findUser(profile.username)
        if(userDB){
            if(userDB.fromGithub){
                return done(null,userDB)
            } else {
                return done(null,false)
            }
        }
        const newUser = {
            first_name: profile.displayName.split(' ') [0],
            last_name: profile.displayName.split(' ') [1],
            username: profile.username,
            password: ' ',
            email: profile.emails[0].value,
            fromGithub: true
        }
        const result = await um.createUser(newUser)
        return done(null,result)
    } catch (error) {
        done(error)
    }
  }
))




passport.serializeUser((usuario, done) => {
    done(null, usuario._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await um.findUserById(id)
        done(null, user)

    } catch (error) {
        done(error)
    }
})