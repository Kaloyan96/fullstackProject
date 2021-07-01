import React, { useState, ReactElement } from 'react';
import { NavLink } from 'react-router-dom'; // NavLink for active style and class. That's all it does.
import { DynamicComponent } from '../DynamicComponents/dynamic-component.model';
import { Section } from '../../model/section.model';

// import "./Nav.css";

interface Props {
  loadedSections: Section[],
  navComponent: DynamicComponent,
  // onSearchPosts: StringCallback;
}

interface INavStruct {
  sectionId: string;
  subsections?: navStruct[];
}

class navStruct implements INavStruct {
  constructor(
    public sectionId: string,
    public subsections?: navStruct[],
  ) { }
}

const fromNavData = (parsedNavData: any[]) => {
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

export default function Nav({ loadedSections, navComponent, ...rest }: Props): ReactElement<Props> {
  // const [searchText, setSearchText] = useState('');
  const navData = JSON.parse(navComponent.data);
  const navStructure = fromNavData(navData);
  console.log(navStructure)
  // console.log(navData);
  const fromId = (targetId: string) => {
    return loadedSections.find(s => s.id === targetId)
  }
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
                      {/* <button>
                        {currentSection.name}
                      </button> */}
                      {item.subsections && item.subsections.length > 0
                        ?
                        <ul>
                          {item.subsections.map((item: navStruct) => {
                            let currentSubsection = fromId(item.sectionId);
                            if (currentSubsection) {
                              return (
                                <li key={item.sectionId}>
                                  <NavLink to={currentSubsection.route}>
                                    {currentSubsection.name}
                                  </NavLink>
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
            {/* Dropdown */}
            {/* <NavLink to="/" activeClassName="active" id="logo-container" className="brand-logo">
              <i className="large material-icons">menu</i>
            </NavLink> */}
            {/* <NavLink to="/home" activeClassName="active" id="logo-container" className="brand-logo ">
                <i className="large material-icons">home</i>
              </NavLink>
              <ul className="right hide-on-med-and-down">
                <li>
                  <NavLink to="/статий" activeClassName="active">Новини</NavLink>
                </li>
                <li>
                  <NavLink to="/" activeClassName="active">История</NavLink>
                </li>
                <li>
                  <NavLink to="/" activeClassName="active">АБС</NavLink>
                </li>
                <li>
                  <NavLink to="/" activeClassName="active">СПБ</NavLink>
                </li>
                <li>
                  <NavLink to="/" activeClassName="active">Комисии</NavLink>
                </li>
                <li>
                  <NavLink to="/" activeClassName="active">Контакти</NavLink>
                </li>
                <li>
                  <NavLink to="/" activeClassName="active">Галерия</NavLink>
                </li>
                <li>
                  <NavLink to="/add-article" activeClassName="active">Add Article</NavLink>
                </li> */}
            {/* </ul> */}
          </div>
        </nav>
      </div>
    </React.Fragment>
  );

  // function handleTextChanged(event: React.ChangeEvent<HTMLInputElement>) {
  //   setSearchText(event.target.value);
  // }

  // function submitSearch(event: React.MouseEvent<HTMLElement, MouseEvent>) {
  //   // onSearchPosts(searchText);
  //   setSearchText('');
  // }
}
