import { Router } from 'express';
import * as indicative from 'indicative';

import { AppError } from '../model/errors';

import { SectionUplink } from '../dao/section-uplink';

const router = Router();

router.route('/')
    .get(async (req, res, next) => {
        console.log(`Requested All sections at ${new Date}`);
        (<SectionUplink>req.app.locals.sectionUplink).findAll()
            .then(sections => res.json(sections))
            .catch(next);
    })
    .post(/*verifyToken*//*,*/ /*verifyRole([Role.AUTHOR, Role.ADMIN]),*/async function (req, res, next) {
        // validate new section
        const newSection = req.body;
        indicative.validator.validate(newSection, {
            _id: 'regex:^[0-9a-fA-F]{24}$',
            name: 'required|string|min:1|max:30',
        }).then(async () => {
            try {
                const created = await (<SectionUplink>req.app.locals.sectionUplink).add(newSection);

                res.status(201).location(`/api/sections/${newSection.id}`).json(newSection);
            } catch (err) {
                next(err);
            }
        }).catch(err => next(new AppError(400, err.message, err)));
    });

//     router.put('/:id', async (req, res, next) => {
//     console.log("AAAAAAAAAAAAA")
// })

router.route('/:id')
    .all(async (req, res, next) => {
        console.log(`Request for section ${req.params.id} at ${new Date}`);
        // validate id
        try {
            const id = req.params.id;
            await indicative.validator.validate({ id }, {
                id: 'required|regex:^[0-9a-fA-F]{24}$'
            });
            next();
        } catch (err) {
            next(new AppError(400, err.message, err));
            return;
        }
    })
    .get(async (req, res, next) => {
        // find section
        console.log(`Get request for section ${req.params.id} at ${new Date}`);
        try {
            const found = await (<SectionUplink>req.app.locals.sectionUplink).findById(req.params.id)
            res.json(found); //200 OK with deleted section in the body
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        // validate edited section
        const section = req.body;
        console.log(`Put request for section ${req.params.id} at ${new Date}`);
        try {
            await indicative.validator.validate(section, {
                _id: 'required|regex:^[0-9a-fA-F]{24}$',
                name: 'required|string|min:1|max:30',
            });
        } catch (err) {
            next(new AppError(400, err.message, err));
            return;
        }
    
        try {
            const sectionId = req.params.id;
    
            if (sectionId !== section._id) {
                next(new AppError(400, `IDs in the URL and message body are different.`));
                return;
            }
            const found = await (<SectionUplink>req.app.locals.sectionUplink).findById(req.params.id);

            // _id is unmodifiable
            section._id = found._id;
            const updated = await (<SectionUplink>req.app.locals.sectionUplink).edit(section);
            res.json(updated); //200 OK with section in the body
        } catch (err) {
            next(err);
        }
    })
    .delete(async function (req, res, next) {
        try {
            const sectionId = req.params.id;
            const deleted = await (<SectionUplink>req.app.locals.sectionUplink).deleteById(sectionId);
            res.json(deleted); //200 OK with deleted section in the body
        } catch (err) {
            next(err);
        }
    })
export default router;