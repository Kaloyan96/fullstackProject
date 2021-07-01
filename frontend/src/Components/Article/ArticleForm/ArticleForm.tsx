// import { DisplayFormikState } from '../DisplayFormikState/DispalyFormikState';

import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, withFormik } from 'formik';

import { EditorState } from 'draft-js';
// import { EditorState } from 'react-draft-wysiwyg';
// import { EditorState, RichUtils } from 'draft-js';

import * as Yup from 'yup';

import './ArticleForm.css';
import MaterialFiled from '../../MaterialField/MaterialField';
import { Article } from '../../../model/article.model';
import { ArticleCallback } from '../../../common/common-types';
import ArticleService from '../../../service/article-service';
import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'
import { stateToHTML } from 'draft-js-export-html';

interface Props {
    article: Article | undefined;
    onSubmitArticle: ArticleCallback;
}

export interface MyFormValues {
    id: string;
    title: string;
    editorState: EditorState;
    // editorState: RawDraftContentState;
    text: string;
    imageUrl?: string;
    // categories?: string;
    // keywords?: string;
}

interface ArticleFormParams {
    articleId: string;
}

export const ArticleForm: FC<Props> = ({ article, onSubmitArticle }) => {
    const [initialValues, setInitialValues] = useState<MyFormValues>({
        id: article?.id || '',
        title: article?.title || '',
        // editorState: EditorState.createEmpty(),
        editorState: EditorState.createEmpty(),
        text: article?.text || '',
        imageUrl: article?.imageUrl || '',
        // categories: article?.categories?.join(', ') || '',
        // keywords: article?.keywords.join(', ') || ''
    });

    const params = useParams<ArticleFormParams>();

    useEffect(() => {
        if (params.articleId) {
            ArticleService.getArticleById(params.articleId).then(
                article => setInitialValues({
                    id: article?.id || '',
                    title: article?.title || '',
                    text: article?.text || '',
                    editorState: EditorState.createEmpty(),
                    imageUrl: article?.imageUrl || '',
                    // categories: article?.categories?.join(', ') || '',
                    // keywords: article?.keywords.join(', ') || ''
                })
            )
        }
    }, [params.articleId]);

    // useEffect(() => {
    //     Array.from(document.getElementsByTagName('textarea')).map(txtarea => window.M.textareaAutoResize(txtarea));
    // });
    return (
        <Formik initialValues={initialValues}
            onSubmit={values => {
                const result = {
                    id: values.id,
                    title: values.title,
                    text: stateToHTML(values.editorState.getCurrentContent()),
                    // editorState: values.editorState,
                    imageUrl: values.imageUrl,
                    authorId: '1',
                    // keywords: values.keywords?.trim().split(/[\s,;]+/).filter(kword => kword.length > 0),
                    // categories: values.categories?.trim().split(/[\s,;]+/).filter(kword => kword.length > 0)
                } as Article;
                onSubmitArticle(result);
                // console.log(result.text)
                // console.log(result);
            }}
            validateOnChange
            validationSchema={Yup.object().shape({
                title: Yup.string().required().min(2).max(40),
                // text: Yup.string().required().min(2).max(1024),
                imageUrl: Yup.string().url(),
                // keywords: Yup.string().trim().matches(/^([\w-_+]+)([,\s]+([\w-_+]+))*$/, 'Keywords must be a comma/space separated list of words. Words should contain only letters, digits, "_", "+" and "-" characters.'),
                // categories: Yup.string().trim().matches(/^([\w-_+]+)([,\s]+([\w-_+]+))*$/, 'Categories must be a comma/space separated list of words. Words should contain only letters, digits, "_", "+" and "-" characters.'),
            })}
        >
            {({ values, handleChange, dirty, touched, errors, isSubmitting, setFieldValue, handleReset }) => {
                return (
                    <Form className="col s6">
                        <div className="row">
                            <MaterialFiled name='title' label='Title' />
                            <MaterialFiled name='imageUrl' label='Article Image URL' />
                            {/* <MaterialFiled name='text' displayAs='textarea' label='Article'/> */}
                            {/* <RichTextEditor /> */}
                            
                            <RichTextEditor editorState={values.editorState} onChange={setFieldValue} />

                            {/* <Editor editorState={values.editorState} onChange={(editorState)=>{setFieldValue('editorState',editorState)}} /> */}
                            {/* <MaterialFiled name='keywords' label='Keywords' /> */}
                            {/* <MaterialFiled name='categories' label='Categories' /> */}
                        </div>
                        <div className="ArticleForm-butons row">
                            {/* <button className="btn waves-effect waves-light" type="submit" name="action" disabled={isSubmitting ||
                                !dirty || Object.values(errors).some(err => !!err === true)}>Submit<i className="material-icons right">send</i>
                            </button> */}
                            <button className="btn waves-effect waves-light" type="submit" name="action">Submit<i className="material-icons right">send</i>
                            </button>
                            <button type="button" className="btn red waves-effect waves-light" onClick={handleReset}
                                disabled={!dirty || isSubmitting}> Reset <i className="material-icons right">settings_backup_restore</i>
                            </button>
                        </div>
                        {/* <DisplayFormikState /> */}
                    </Form>
                )
            }}
        </Formik>
    );
};