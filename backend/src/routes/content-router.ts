import { Router } from 'express';
import * as indicative from 'indicative';

import { AppError } from '../model/errors';

import { ContentUplink } from '../dao/content-uplink';

const router = Router();

router.route('/')
    .get(async (req, res, next) => {
        console.log("Requested All content");
        (<ContentUplink>req.app.locals.contentUplink).findAll()
            .then(contents => res.json(contents))
            .catch(next);
    })
    .post(/*verifyToken*//*,*/ /*verifyRole([Role.AUTHOR, Role.ADMIN]),*/ function (req, res, next) {
        // validate new post
        const newcontent = req.body;
        indicative.validator.validate(newcontent, {
            _id: 'regex:^[0-9a-fA-F]{24}$',
            // authorId: 'required|regex:^[0-9a-fA-F]{24}$',
            // contentid: 'required|regex:^[0-9a-fA-F]{24}$',
            // authorId: 'required|regex:^[0-9a-fA-F]{24}$',s
            // imageUrl: 'url',
            // categories: 'array',
            // 'categories.*': 'string',
            // keywords: 'array',
            // 'keywords.*': 'string',
        }).then(async () => {
            // create post in db
            try {

                //TODO set correct author
                // const defaultUser = await (<UserRepository>req.app.locals.userRepo).findByUsername("trayan");
                // newPost.authorId = defaultUser._id;

                // Create new User
                // console.log()
                const created = await (<ContentUplink>req.app.locals.contentUplink).add(newcontent);

                res.status(201).location(`/api/contents/${newcontent.id}`).json(newcontent);
            } catch (err) {
                next(err);
            }
        }).catch(err => next(new AppError(400, err.message, err)));
    });

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
        console.log(`${(new Date).toLocaleTimeString()}: Request for content ${req.params.id}`);
        try {
            const found = await (<ContentUplink>req.app.locals.contentUplink).findById(req.params.id)
            res.json(found); //200 OK with deleted post in the body
        } catch (err) {
            next(err);
        }
    })
    .put(async function (req, res, next) {
        // validate edited post
        const content = req.body;
        try {
            await indicative.validator.validate(content, {
                _id: 'required|regex:^[0-9a-fA-F]{24}$',
                // authorId: 'required|regex:^[0-9a-fA-F]{24}$',
                // contentid: 'required|regex:^[0-9a-fA-F]{24}$',
                // authorId: 'required|regex:^[0-9a-fA-F]{24}$',s
                // imageUrl: 'url',
                // categories: 'array',
                // 'categories.*': 'string',
                // keywords: 'array',
                // 'keywords.*': 'string',
            });
        } catch (err) {
            next(new AppError(400, err.message, err));
            return;
        }
    
        try {
            const contentId = req.params.id;
    
            if (contentId !== content._id) {
                next(new AppError(400, `IDs in the URL and message body are different.`));
                return;
            }
            const found = await (<ContentUplink>req.app.locals.contentUplink).findById(req.params.id);
            if (content.componentId && content.componentId.length > 0 && found.componentId !== content.componentId) {
                throw new AppError(400, `Can not change content author.`);
            }
            if (content.authorId && content.authorId.length > 0 && found.authorId !== content.authorId) {
                throw new AppError(400, `Can not change content component.`);
            }
            // _id and authorId are unmodifiable
            content._id = found._id;
            content.componentId = found.componentId;
            content.authorId = found.authorId;
            const updated = await (<ContentUplink>req.app.locals.contentUplink).edit(content);
            res.json(updated); //200 OK with content in the body
        } catch (err) {
            next(err);
        }
    })
    .delete(async function (req, res, next) {
        try {
            const contentId = req.params.id;
            const deleted = await (<ContentUplink>req.app.locals.contentUplink).deleteById(contentId);
            res.json(deleted); //200 OK with deleted content in the body
        } catch (err) {
            next(err);
        }
    })
export default router;