// import { DisplayFormikState } from '../DisplayFormikState/DispalyFormikState';

import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, withFormik, Field } from 'formik';

import * as Yup from 'yup';

import MaterialFiled from '../MaterialField/MaterialField';
import { availableComponents, DynamicComponent } from '../DynamicComponents/dynamic-component.model';
import { DynamicComponentCallback } from '../../common/common-types';
import dynamicComponentService from '../../service/dynamic-component-service';

interface Props {
    component: DynamicComponent | undefined;
    onSubmitComponent: DynamicComponentCallback;
}

export interface MyFormValues {
    id: string;
    name: string;
    type: string;
}

interface ComponentFormParams {
    componentId: string;
    name: string;
}

export const ComponentForm: FC<Props> = ({ component, onSubmitComponent }) => {
    const [initialValues, setInitialValues] = useState<MyFormValues>({
        id: component?.id || '',
        name: component?.name || '',
        type: component?.type || '',
    });

    const params = useParams<ComponentFormParams>();

    useEffect(() => {
        if (params.componentId) {
            dynamicComponentService.getDynamicComponentById(params.componentId).then(
                component => {
                    setInitialValues({
                        id: component?.id || '',
                        name: component?.name || '',
                        type: component?.type || '',
                    })
                }
            )
        }
    }, [params.componentId]);

    let componentTypes: any = [];
    for (const cmpType in availableComponents) {
        componentTypes = [...componentTypes, cmpType];
    }

    console.log(initialValues);

    return (
        <Formik initialValues={initialValues}
            enableReinitialize
            onSubmit={values => {
                const result = {
                    id: values.id,
                    name: values.name,
                    type: values.type,
                } as DynamicComponent;
                onSubmitComponent(result);
            }}
            validateOnChange
            validationSchema={Yup.object().shape({
                name: Yup.string().required().min(1).max(30),
                type: Yup.string().required().min(1),
            })}
        >
            {({ values, handleChange, dirty, touched, errors, isSubmitting, setFieldValue, handleReset }) => {
                return (
                    <Form className="col s6">
                        <div className="row">
                            <MaterialFiled name='name' label='Name' />
                        </div>
                        <div className="row">
                            <select
                                name="type"
                                value={values.type}
                                onChange={handleChange}
                                style={{ display: 'block' }}
                            >
                                <option value="" label="Select type" />
                                {componentTypes.map((cmpType: any) => (
                                    <option value={cmpType} label={cmpType} />
                                ))}
                            </select>
                        </div>
                        <div className="ComponentForm-butons row">
                            {/* <button className="btn waves-effect waves-light" type="submit" name="action" disabled={isSubmitting ||
                                !dirty || Object.values(errors).some(err => !!err === true)}>Submit<i className="material-icons right">send</i>
                            </button> */}
                            <button className="btn waves-effect waves-light" type="submit" name="action">Submit<i className="material-icons right">send</i>
                            </button>
                            <button type="button" className="btn red waves-effect waves-light" onClick={handleReset}
                                disabled={!dirty || isSubmitting}> Reset <i className="material-icons right">settings_backup_restore</i>
                            </button>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    );
};