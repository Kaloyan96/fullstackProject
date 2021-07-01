import { Router } from 'express';
import * as indicative from 'indicative';

import { AppError } from '../model/errors';

import { ArticleUplink } from '../dao/article-uplink';

const router = Router();

router.route('/')
    .get(async (req, res, next) => {
        console.log("Requested All articles");
        (<ArticleUplink>req.app.locals.articleUplink).findAll()
            .then(articles => res.json(articles))
            .catch(next);
    })
    .post(/*verifyToken*//*,*/ /*verifyRole([Role.AUTHOR, Role.ADMIN]),*/ function (req, res, next) {
        // validate new post
        const newArticle = req.body;
        indicative.validator.validate(newArticle, {
            _id: 'regex:^[0-9a-fA-F]{24}$',
            title: 'required|string|min:3|max:30',
            text: 'required|string|min:3|max:16384',
            // authorId: 'required|regex:^[0-9a-fA-F]{24}$',s
            imageUrl: 'url',
            categories: 'array',
            'categories.*': 'string',
            keywords: 'array',
            'keywords.*': 'string',
        }).then(async () => {
            // create post in db
            try {

                //TODO set correct author
                // const defaultUser = await (<UserRepository>req.app.locals.userRepo).findByUsername("trayan");
                // newPost.authorId = defaultUser._id;

                // Create new User
                // console.log()
                const created = await (<ArticleUplink>req.app.locals.articleUplink).add(newArticle);

                res.status(201).location(`/api/articles/${newArticle.id}`).json(newArticle);
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
        // find post
        try {
            const found = await (<ArticleUplink>req.app.locals.articleUplink).findById(req.params.id)
            res.json(found); //200 OK with deleted post in the body
        } catch (err) {
            next(err);
        }
    })
    .put(async function (req, res, next) {
        // validate edited post
        const article = req.body;
        try {
            await indicative.validator.validate(article, {
                _id: 'required|regex:^[0-9a-fA-F]{24}$',
                title: 'required|string|min:3|max:30',
                text: 'required|string|min:3|max:1024',
                // authorId: 'required|regex:^[0-9a-fA-F]{24}$',s
                imageUrl: 'url',
                categories: 'array',
                'categories.*': 'string',
                keywords: 'array',
                'keywords.*': 'string',
            });
        } catch (err) {
            next(new AppError(400, err.message, err));
            return;
        }
    
        try {
            const articleId = req.params.id;
    
            if (articleId !== article._id) {
                next(new AppError(400, `IDs in the URL and message body are different.`));
                return;
            }
            const found = await (<ArticleUplink>req.app.locals.articleUplink).findById(req.params.id);
            if (article.authorId && article.authorId.length > 0 && found.authorId !== article.authorId) {
                throw new AppError(400, `Can not change Post's author.`);
            }
            // _id and authorId are unmodifiable
            article._id = found._id;
            article.authorId = found.authorId;
            const updated = await (<ArticleUplink>req.app.locals.articleUplink).edit(article);
            res.json(updated); //200 OK with article in the body
        } catch (err) {
            next(err);
        }
    })
    .delete(async function (req, res, next) {
        try {
            const articleId = req.params.id;
            const deleted = await (<ArticleUplink>req.app.locals.articleUplink).deleteById(articleId);
            res.json(deleted); //200 OK with deleted article in the body
        } catch (err) {
            next(err);
        }
    })
export default router;