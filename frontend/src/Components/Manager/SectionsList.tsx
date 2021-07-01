import React, { useState, ReactElement, FC } from 'react';
import { Link, NavLink, useRouteMatch } from 'react-router-dom';

import { Section } from '../../model/section.model';
import { ManagerRoutes } from './Manager';

interface Props {
    sections: Section[];
    parentURL: string;
}

export const SectionsList: FC<Props> = ({ sections, parentURL }) => {
    let { url } = useRouteMatch();

    return (
        <React.Fragment>
            <ul
                className="sections"
            >
                {sections.map((item, index) => (
                    <li key={item.id}>
                        <div>{item.name}</div>
                        {/* {console.log(item)} */}

                        <NavLink to={`${parentURL}/${ManagerRoutes.EditSection}/${item.id}`}>Edit</NavLink>
                    </li>
            ))}
            </ul>
        </React.Fragment>
    )
}