// import { DisplayFormikState } from '../DisplayFormikState/DispalyFormikState';

import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, withFormik } from 'formik';

import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
// import { EditorState } from 'react-draft-wysiwyg';
// import { EditorState, RichUtils } from 'draft-js';

import * as Yup from 'yup';

// import './ArticleForm.css';
import { Content } from '../../model/content.model';
import { ContentCallback } from '../../common/common-types';
import contentService from '../../service/content-service';
import { RichTextEditor } from '../RichTextEditor/RichTextEditor';
import MaterialFiled from '../MaterialField/MaterialField';
import { RootState } from '../../app/rootReducer';
import { useSelector } from 'react-redux';
import { availableComponents, DynamicComponent } from '../DynamicComponents/dynamic-component.model';

interface Props {
    content: Content | undefined;
    onSubmitContent: ContentCallback;
}

export interface MyFormValues {
    id: string;
    componentId: string,
    editorState: EditorState;
    // editorState: RawDraftContentState;
    // text: string;
    // imageUrl?: string;
    // categories?: string;
    // keywords?: string;
}

interface ArticleFormParams {
    articleId: string;
}

// enum editableComponents

export const ContentForm: FC<Props> = ({ content, onSubmitContent }) => {
    const [initialValues, setInitialValues] = useState<MyFormValues>({
        id: content?.id || '',
        componentId: content?.componentId || '',
        editorState: EditorState.createEmpty(),
        // categories: article?.categories?.join(', ') || '',
        // keywords: article?.keywords.join(', ') || ''
    });

    const loadedComponents = useSelector((state: RootState) => state.dynamicComponents.dynamicComponents);

    const componentFromId = (targetId: string) => {
        return loadedComponents.find(c => c.id === targetId)
    }


    const params = useParams<ArticleFormParams>();

    useEffect(() => {
        if (params.articleId) {
            contentService.getContentById(params.articleId).then(
                content => setInitialValues({
                    id: content?.id || '',
                    componentId: content?.componentId || '',
                    editorState: EditorState.createEmpty(),
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
                let cmpId: any;
                let component: DynamicComponent;
                if (content) {
                    let loaded = componentFromId(content.componentId);
                    if (loaded !== undefined) {
                        component = loaded;
                        if (component.type === availableComponents.HTMLPage) {
                            cmpId=content.componentId;
                        }else{
                            cmpId=component.id;
                        }
                    }
                }
                const result = {
                    id: values.id,
                    authorId: '1',
                    componentId: cmpId,
                    data: stateToHTML(values.editorState.getCurrentContent()),
                } as Content;
                onSubmitContent(result);
                // console.log(result);
            }}
            validateOnChange
            validationSchema={
                Yup.object().shape({
                    
                })
            }
        >
            {({ values, handleChange, dirty, touched, errors, isSubmitting, setFieldValue, handleReset }) => {
                return (
                    <Form className="col s6">
                        <div className="row">
                            <MaterialFiled name='title' label='Title' />
                            <MaterialFiled name='imageUrl' label='Article Image URL' />
                            <div className="row">
                                Top:
                                <select
                                    name="componentId"
                                    value={values.componentId}
                                    onChange={handleChange}
                                    style={{ display: 'block' }}
                                >
                                    <option value="" label="Select component" />
                                    {loadedComponents.map((cmp: DynamicComponent) => (
                                        <option value={cmp.id} label={cmp.name} />
                                    ))}
                                </select>
                            </div>
                            <RichTextEditor editorState={values.editorState} onChange={setFieldValue} />
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
        </Formik >
    );
};