import { Router } from 'express';
import * as indicative from 'indicative';

import { AppError } from '../model/errors';

import { ComponentUplink } from '../dao/component-uplink';

const router = Router();

router.route('/')
    .get(async (req, res, next) => {
        console.log(`${(new Date).toLocaleTimeString()}: Requested All components at ${new Date}`);
        (<ComponentUplink>req.app.locals.componentUplink).findAll()
            .then(components => { res.json(components.map(cmp => { cmp.data = JSON.parse(cmp.data); return cmp; })) })
            .catch(next);
    })
    .post(/*verifyToken*//*,*/ /*verifyRole([Role.AUTHOR, Role.ADMIN]),*/async function (req, res, next) {
        // validate new component
        let newComponent = req.body;
        indicative.validator.validate(newComponent, {
            name: 'required|string|min:1|max:30',
        }).then(async () => {
            try {
                newComponent.data = JSON.stringify(newComponent.data);
                const created = await (<ComponentUplink>req.app.locals.componentUplink).add(newComponent);

                res.status(201).location(`/api/components/${newComponent.id}`).json(newComponent);
            } catch (err) {
                next(err);
            }
        }).catch(err => next(new AppError(400, err.message, err)));
    });

// router.put('/:id', async (req, res, next) => {
//     console.log("AAAAAAAAAAAAA")
// })
router.route('/:id')
    .all(async (req, res, next) => {
        console.log(`${(new Date).toLocaleTimeString()}: Request for component ${req.params.id} at ${new Date}`);
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
        // find component
        console.log(`Get request for component ${req.params.id} at ${new Date}`);
        try {
            let found = await (<ComponentUplink>req.app.locals.componentUplink).findById(req.params.id)
            found.data=JSON.parse(found.data);
            res.json(found);
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        // validate edited component
        const component = req.body;
        console.log(`${(new Date).toLocaleTimeString()}: Put request for component ${req.params.id}`);
        try {
            await indicative.validator.validate(component, {
                name: 'required|string|min:1|max:30',
            });
        } catch (err) {
            next(new AppError(400, err.message, err));
            return;
        }

        try {
            const componentId = req.params.id;

            if (componentId !== component._id) {
                next(new AppError(400, `IDs in the URL and message body are different.`));
                return;
            }
            let found = await (<ComponentUplink>req.app.locals.componentUplink).findById(req.params.id);
            found.data = JSON.parse(found.data);

            // _id is unmodifiable
            component._id = found._id;
            const updated = await (<ComponentUplink>req.app.locals.componentUplink).edit(component);
            res.json(updated); //200 OK with component in the body
        } catch (err) {
            next(err);
        }
    })
    .delete(async function (req, res, next) {
        try {
            const componentId = req.params.id;
            const deleted = await (<ComponentUplink>req.app.locals.componentUplink).deleteById(componentId);
            res.json(deleted); //200 OK with deleted component in the body
        } catch (err) {
            next(err);
        }
    })
export default router;