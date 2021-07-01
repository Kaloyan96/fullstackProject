import React, { ReactElement } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import { Section, SectionStatus } from '../../model/section.model';
import { ManagerRoutes } from './Manager';

interface Props {
    
}

export default function ManagerNav({ ...rest }: Props): ReactElement<Props> {

    let { url } = useRouteMatch();

    return (
        <React.Fragment>
            <ul>
                <li>
                    <Link to={`${url}`}>Overview</Link>
                </li>
                <li>
                    <Link to={`${url}/${ManagerRoutes.Preview}`}>Navigation Preview</Link>
                </li>
                <li>
                    <Link to={`${url}/${ManagerRoutes.All}`}>All Sections</Link>
                </li>
                <li>
                    <Link to={`${url}/${ManagerRoutes.AddSection}`}>Create Section</Link>
                </li>
                <li>
                    <Link to={`${url}/${ManagerRoutes.AddComponent}`}>Create Component</Link>
                </li>
                <li>
                    <Link to={`${url}/${ManagerRoutes.AddContent}`}>Create Content</Link>
                </li>
            </ul>
        </React.Fragment>
    )
}