import React, { useState, ReactElement, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'; // NavLink for active style and class. That's all it does.
import { RootState } from '../../../app/rootReducer';
import { fetchDynamicComponents } from '../../../features/dynamic-components/dynamicComponentsSlice';
import { Section } from '../../../model/section.model';
import { DynamicComponent } from '../dynamic-component.model';
// import { DynamicComponent } from '../../model/dynamic-component.model';
// import { Section } from '../../model/section.model';
// import { navStruct } from './TopNav.model';

// import "./Nav.css";

interface Props {
  navComponent: DynamicComponent,
  // onSearchPosts: StringCallback;
}

class navStruct {
  constructor(
      public sectionId: string,
      public subsections?: navStruct[],
  ) { }
}

const fromData = (parsedNavData: any[]) => {
  // console.log(parsedNavData)
  let res: navStruct[] = parsedNavData.map(
      (item: any) => {
          let res = new navStruct(item.sectionId);
          if (item.subsections?.length > 0) {
              res.subsections = item.subsections.map((subs: any) => new navStruct(subs));
          }
          return res;
      }
  )
  return res;
}

export default function TopNavComponent({ navComponent, ...rest }: Props): ReactElement<Props> {
  const loadedSections = useSelector((state: RootState) => state.sections.sections);

  const fromId = (targetId: string) => {
    return loadedSections.find(s => s.id === targetId)
  }

  let navStructure = fromData(navComponent.data);

  return (
    <React.Fragment>
      <div className="navbar top-nav">
        <nav className="light-blue lighten-1" role="navigation">
          <div className="nav-wrapper container">
            <ul>
              {navStructure.map((item: navStruct) => {
                let currentSection = fromId(item.sectionId);
                if (currentSection && currentSection.route) {
                  return (
                    <li key={item.sectionId}>
                      <NavLink to={currentSection.route}>
                        {currentSection.name}
                      </NavLink>
                      {item.subsections && item.subsections.length > 0
                        ?
                        <ul>
                          {item.subsections.map((item: navStruct) => {
                            let currentSubsection = fromId(item.sectionId);
                            if (currentSubsection) {
                              return (
                                <li key={item.sectionId}>
                                  {/* <Dropdown> */}
                                    <NavLink to={currentSubsection.route}>
                                      {currentSubsection.name}
                                    </NavLink>
                                  {/* </Dropdown> */}
                                </li>
                              )
                            } else return <></>
                          }
                          )}
                        </ul>
                        : <></>}
                    </li>)
                } else return <></>
              })}
            </ul>
          </div>
        </nav>
      </div>
    </React.Fragment>
  );
}
