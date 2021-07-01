import React, { ReactElement } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { componentSlots, Section, SectionStatus, SectionTemplate } from '../../../model/section.model';
import ComponentLoader from '../../ComponentLoader/ComponentLoader';

interface Props {
    sectionToLoad: Section,
    // sectionTemplate: SectionTemplate,
}

export default function SectionLoader({ sectionToLoad, ...rest }: Props): ReactElement<Props> {
    // console.log(sectionToLoad)

    return (
        <React.Fragment>
            {sectionToLoad.components
                ?
                <>
                    {sectionToLoad.components[componentSlots.Top]
                        ?
                        <div className="TopComponent">
                            <ComponentLoader componentToLoad={sectionToLoad.components[componentSlots.Top]} />
                        </div>
                        : <></>}
                    {sectionToLoad.components[componentSlots.Center]
                        ?
                        <div className="CenterComponent">
                            <ComponentLoader componentToLoad={sectionToLoad.components[componentSlots.Center]} />
                        </div>
                        : <></>}
                </>
                : <></>}

        </React.Fragment>
    )
}