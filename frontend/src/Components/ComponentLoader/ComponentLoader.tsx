import React, { ReactElement } from 'react';

import { availableComponents, DynamicComponent } from '../DynamicComponents/dynamic-component.model';
import { Section } from '../../model/section.model';
import TopNavComponent from '../DynamicComponents/TopNav/TopNavComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/rootReducer';
import { HTMLPageComponent } from '../DynamicComponents/HTMLPage/HTMLPageComponent';


interface Props {
    componentToLoad: DynamicComponent,
}

const typeToComp = {
    [availableComponents.TopNav]: TopNavComponent,
}

export default function ComponentLoader({ componentToLoad, ...rest }: Props): ReactElement<Props> {
    // const loadedComponents = useSelector((state: RootState) => state.dynamicComponents.dynamicComponents);

    let component = () => {
        if (componentToLoad.type === availableComponents.TopNav) {
            return (
                <TopNavComponent navComponent={componentToLoad} />
            );
        }else if(componentToLoad.type === availableComponents.HTMLPage){
            return (
                <HTMLPageComponent HTMLPage={componentToLoad} />
            );
        }
    }

    console.log(componentToLoad)
    // console.log(component)
    return (
        <React.Fragment>
            {component()}
        </React.Fragment>
    )
}