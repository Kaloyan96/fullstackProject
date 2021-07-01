import { Router } from 'express';
import * as indicative from 'indicative';
import * as bcrypt from 'bcryptjs';
// import { userInfo } from 'os';

import { User } from '../model/user.model';
import { UserUplink } from '../dao/user-uplink';
import { AppError } from '../model/errors';

const router = Router();
const salt = 8;

router.route('/')
    .get(async (req, res, next) => {
        (<UserUplink>req.app.locals.userUplink).findAll()
            .then(users => res.json(users.map(user => { delete user.password; return user; })))
            .catch(next);
    })
    .post(async (req, res, next) => {
        // validate new user
        const newUser = req.body as User;
        try {
            await indicative.validator.validate(newUser, {
                // "_id": 'regex:^[0-9a-fA-F]{24}$',
                'firstName': 'required|string',
                'lastName': 'required|string',
                'username': 'required|string',
                'email': 'required|string',
                'password': 'required|string',
                'imageUrl': 'url',
                'roles': 'required|array',
                'roles.*': 'string'
            });
        } catch (err) {
            next(new AppError(400, err.message, err));
            return;
        }

        // create user in db
        try {
            const found = await (<UserUplink>req.app.locals.userUplink).findByUsername(newUser.username);
            if (found) {
                throw new AppError(400, `Username already taken: '${newUser.username}'.`);
            }
            else {
                newUser.password = await bcrypt.hash(newUser.password, salt);

                const created = await (<UserUplink>req.app.locals.userUplink).add(newUser);
                delete created.password;

                res.status(201).location(`/api/users/${newUser._id}`).json(newUser);
            }
        } catch (err) {
            next(err);
        }
    });

// router.param('user_id') // TODO

router.route('/:id')
    .all(async (req, res, next) => {
        // validate id
        try {
            const id = req.params.id;
            await indicative.validator.validate({ id }, {
                id: 'required|regex:^[0-9a-fA-F]{24}$'
            });
        } catch (err) {
            next(new AppError(400, err.message, err));
            return;
        }
    })
    .get(async (req, res, next) => {
        // find user
        try {
            const found = await (<UserUplink>req.app.locals.userUplink).findById(req.params.id);
            delete found.password;
            res.json(found); //200 OK with deleted user in the body
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        // validate edited user
        const user = req.body as User;
        try {
            await indicative.validator.validate(user, {
                'firstName': 'required|string',
                'lastName': 'required|string',
                'username': 'required|string',
                'email': 'required|string',
                'password': 'required|string',
                'imageUrl': 'url',
                'roles': 'required|array',
                'roles.*': 'string'
            });
        } catch (err) {
            next(new AppError(400, err.message, err));
            return;
        }

        try {
            const userId = req.params.id;

            if (userId !== user._id) {
                next(new AppError(400, `IDs in the URL and message body are different.`));
                return;
            }
            const found = await (<UserUplink>req.app.locals.userUplink).findById(req.params.id);
            if (user.username && user.username.length > 0 && found.username !== user.username) {
                throw new AppError(400, `Can not change username.`);
            }

            //test behaviour
            user._id = found._id;
            user.username = found.username;
            ////

            delete user.password;
            const updated = await (<UserUplink>req.app.locals.userUplink).edit(user);
            res.json(updated); //200 OK with user in the body
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const userId = req.params.id;
            const deleted = await (<UserUplink>req.app.locals.userUplink).deleteById(userId);
            delete deleted.password;
            res.json(deleted); //200 OK with deleted user in the body
        } catch (err) {
            next(err);
        }
    });

export default router;
