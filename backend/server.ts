import * as express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import { MongoClient } from 'mongodb';

// import { PostRepository, UserRepository } from './dao/mongo-repository';
import { UserUplink } from './src/dao/user-uplink';
import { SectionUplink } from './src/dao/section-uplink';
import { ComponentUplink } from './src/dao/component-uplink';
import { ContentUplink } from './src/dao/content-uplink';

// import { Post } from './model/post.model';
import { User } from './src/model/user.model';
import { Section } from './src/model/section.model';
import { Component } from './src/model/component.model';
import { Content } from './src/model/content.model';

import usersRouter from './src/routes/users-router';
import contentRouter from './src/routes/content-router';
import sectionsRouter from './src/routes/sections-router';
import componentsRouter from './src/routes/component-router';

// import authRouter from './routes/auth-router';

// const POSTS_FILE = path.join(__dirname, '../posts.json');
const DB_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'projectDevDB';
const PORT = process.env.PORT || 1337;

let connection: MongoClient;



async function start() {
    const app = express();

    const db = await initDataDb(DB_URL, DB_NAME);
    // console.log(db);

    const userUplink = new UserUplink(User, db, 'users');
    app.locals.userUplink = userUplink;

    const sectionUplink = new SectionUplink(Section, db, 'sections');
    app.locals.sectionUplink = sectionUplink;

    const componentUplink = new ComponentUplink(Component, db, 'components');
    app.locals.componentUplink = componentUplink;

    const contentUplink = new ContentUplink(Content, db, 'content');
    app.locals.contentUplink = contentUplink;
    
    // const postRepo = new PostRepository(Post, db, 'posts');
    // app.locals.postRepo = postRepo;

    app.set('port', PORT);

    // app.use('/', express.static(path.join(__dirname, '../public')));
    app.use(express.json()); // either this works or I have to lose another 10 hours on looking at cors bs

    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*'); // Set to * so that I can make requests from laptop
        res.setHeader('Access-Control-Allow-Headers', '*'); // Some headers don't work if not * for some reason
        res.setHeader(`Access-Control-Allow-Methods`, `GET, POST, PUT, DELETE, OPTIONS`); // stackoverflow says allowimg methods with * is bad. If not enabled sometimes doesn't send
        res.setHeader(`Access-Control-Request-Methods`, `GET, POST, PUT, DELETE, OPTIONS`); // stackoverflow says allowimg methods with * is bad. If not enabled sometimes doesn't send
        res.setHeader('Access-Control-Max-Age', 99999); // try and disapear now 
        res.setHeader('Cache-Control', 'no-cache'); // keep or sometimes new data doesn't load
        next(); // keep this or the "callstack" gets disrupted.
    });

    // app.use(cors)

    // attach feature routers
    app.use('/api/users', usersRouter);
    app.use('/api/sections', sectionsRouter);
    app.use('/api/components', componentsRouter);
    app.use('/api/content', contentRouter);
    // app.use('/api/auth', authRouter);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => { // copied from 
        if (res.headersSent) {
            next(err);
            return;
        }
        console.error(err);
        const status = err['status'] || 500;
        res.status(status).json({
            status: res.status,
            message: err.message,
            error: req.app.get('env') === 'production' ? '' : err['error'] || err
        });
    });

    // app.locals.postDbFile = POSTS_FILE;

    app.listen(app.get('port'), function () {
        console.log('Server started: http://localhost:' + app.get('port') + '/');
    });
    app.on('close', cleanup); // copied from course. look into it.
}

start();

async function initDataDb(mongoUrl: string, dbName: string) {
    connection = await MongoClient.connect(mongoUrl, {
        useNewUrlParser: true, // avoids using the old/current parser
        useUnifiedTopology: true // allows use of all seven topology classes
    });
    return connection.db(dbName);
}

async function cleanup() { // copied from course. look into it.
    if (connection && connection.isConnected()) {
        return connection.close();
    }
}