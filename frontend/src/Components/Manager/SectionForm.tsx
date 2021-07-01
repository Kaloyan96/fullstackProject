// import { DisplayFormikState } from '../DisplayFormikState/DispalyFormikState';

import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, withFormik, Field } from 'formik';

import * as Yup from 'yup';

import MaterialFiled from '../MaterialField/MaterialField';
import { componentSlots, Section, SectionStatus } from '../../model/section.model';
import SectionService from '../../service/section-service';
import { IdType, SectionCallback } from '../../common/common-types';
import { DynamicComponent } from '../DynamicComponents/dynamic-component.model';

interface Props {
    section: Section | undefined;
    loadedComponents: DynamicComponent[];
    onSubmitSection: SectionCallback;
}

export interface MyFormValues {
    id: string;
    name: string;
    status: SectionStatus;
    componentTop: string;
    componentCenter: string;
    // components: { [s: string]: DynamicComponent };
}

interface SectionFormParams {
    sectionId: string;
}

export const SectionForm: FC<Props> = ({ section, loadedComponents, onSubmitSection }) => {
    const [initialValues, setInitialValues] = useState<MyFormValues>({
        id: section?.id || '',
        name: section?.name || '',
        status: section?.status || SectionStatus.Hidden,
        componentTop: section?.components && section.components[componentSlots.Top] ? section.components[componentSlots.Top].id : '',
        componentCenter: section?.components && section.components[componentSlots.Center] ? section.components[componentSlots.Center].id : '',
    });

    const params = useParams<SectionFormParams>();

    useEffect(() => {
        if (params.sectionId) {
            SectionService.getSectionById(params.sectionId).then(
                section => {
                    setInitialValues({
                        id: section?.id || '',
                        name: section?.name || '',
                        status: section?.status || SectionStatus.Hidden,
                        componentTop: section?.components && section.components[componentSlots.Top] ? section.components[componentSlots.Top].id : '',
                        componentCenter: section?.components && section.components[componentSlots.Center] ? section.components[componentSlots.Center].id : '',
                    })
                }
            )
        }
    }, [params.sectionId]);

    console.log(initialValues);

    const fromId = (targetId: string) => {
        return loadedComponents.find(c => c.id === targetId)
    }

    const fromLavues = (values: MyFormValues) => {
        let res: { [s: string]: DynamicComponent } = {};
        let top = fromId(values.componentTop);
        if (top) {
            res[componentSlots.Top] = top;
        }
        let center = fromId(values.componentCenter);
        if (center) {
            res[componentSlots.Center] = center;
        }
        return res;
    }

    return (
        <Formik initialValues={initialValues}
            enableReinitialize
            onSubmit={values => {
                const result = {
                    id: values.id,
                    name: values.name,
                    status: values.status,
                    components: fromLavues(values)
                } as Section;
                // console.log(result)
                onSubmitSection(result);
            }}
            validateOnChange
            validationSchema={Yup.object().shape({
                name: Yup.string().required().min(1).max(30),
            })}
        >
            {({ values, handleChange, dirty, touched, errors, isSubmitting, setFieldValue, handleReset }) => {
                return (
                    <Form className="col s6">
                        <div className="row">
                            <MaterialFiled name='name' label='Name' />
                        </div>
                        <div className="status">
                            Status:
                            <label>
                                <Field type="radio" name="status" value={SectionStatus.Hidden} />
                                {SectionStatus.Hidden}
                            </label>
                            <label>
                                <Field type="radio" name="status" value={SectionStatus.Visible} />
                                {SectionStatus.Visible}
                            </label>
                        </div>
                        <div className="row">
                            Top:
                            <select
                                name="componentTop"
                                value={values.componentTop}
                                onChange={handleChange}
                                style={{ display: 'block' }}
                            >
                                <option value="" label="Select component" />
                                {loadedComponents.map((cmp: DynamicComponent) => (
                                    <option value={cmp.id} label={cmp.name} />
                                ))}
                            </select>
                        </div>
                        <div className="row">
                            Center:
                            <select
                                name="componentCenter"
                                value={values.componentCenter}
                                onChange={handleChange}
                                style={{ display: 'block' }}
                            >
                                <option value="" label="Select component" />
                                {loadedComponents.map((cmp: DynamicComponent) => (
                                    <option value={cmp.id} label={cmp.name} />
                                ))}
                            </select>
                        </div>
                        <div className="SectionForm-butons row">
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