/* eslint-disable require-jsdoc */
/* eslint-disable class-methods-use-this */
import models from '../db/models';
import auth from '../helpers/auth';
import Mailer from '../helpers/mailer';
import util from '../helpers/utilities';

const UserController = {
    async signUp(req, res) {
          let user = await models.Users.findOne({where: {email: req.body.email}});
            if(user){
                //make changes to jude's work on naming convention change errorstatus to errorStatus
                return util.errorStatus(res, 409, 'email address exist already');
            }
            const hashPassword = auth.hashPassword(req.body.password);
            
            user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashPassword,
              };

            const token = auth.generateToken(user);
            
            try {
                const User = await models.Users.create(user);
                const verificationLink = 'https://sampleverification.com';
                Mailer.sendWelcomeMail(User.email, User.firstName, verificationLink);
                const data = {
                    token,
                    id: User.id,
                    firstName: User.firstName,
                    lastName: User.lastName,
                    email: User.email
                }
                return util.successStatus(res, 201, 'User added successfully', data)
            } catch(err){
                return util.errorStatus(res, 500, 'Internal error');
            }
    }
    
}


export default UserController;
