import React, { useState, ReactElement, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { boolean } from 'yup';
import { ContentCallback, DynamicComponentCallback, SectionCallback } from '../../common/common-types';
import { DynamicComponent } from '../DynamicComponents/dynamic-component.model';

import { Section, SectionStatus } from '../../model/section.model';
import dynamicComponentService from '../../service/dynamic-component-service';
import SectionService from '../../service/section-service';
import ManagerNav from './ManagerNav';
import { SectionForm } from './SectionForm';
import { SectionsList } from './SectionsList';
import SectionsNavEditor from './SectionsNavEditor'
import { RootState } from '../../app/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDynamicComponents } from '../../features/dynamic-components/dynamicComponentsSlice';
import { ComponentForm } from './ComponentForm';
import { ContentForm } from './ContentForm';
import contentService from '../../service/content-service';


interface Props {
  sections: Section[];
  navData: DynamicComponent | undefined;
}

export enum ManagerRoutes {
  Preview = 'sections-nav-preview',
  All = 'list-sections',
  AddSection = 'add-section',
  EditSection = 'edit-section',
  AddComponent = 'add-component',
  EditComponent = 'edit-component',
  AddContent = 'add-content',
  EditContent = 'edit-content',
}


export default function SectionsManager({ sections, navData, ...rest }: Props): ReactElement<Props> {
  const dispatch = useDispatch();

  const history = useHistory();
  const { path } = useRouteMatch();
  const components = useSelector((state: RootState) => state.dynamicComponents.dynamicComponents);

  useEffect(() => {
    dispatch(fetchDynamicComponents());
  }, [dispatch]);
  // console.log(navData);

  const handleDeleteSection: SectionCallback = (section) => {
    SectionService.deleteSection(section.id).then(
      deleted => {
        // setSections(sections.filter(p => p.id !== deleted.id));
        history.push('/sections');
      }
    );
  };

  const handleSubmitSection: SectionCallback = (section) => {
    if (section.id) { //Edit
      SectionService.updateSection(section).then(
        edited => {
          // setSections(sections.map(p => p.id === edited.id ? section : p));
        }
      );
    } else { //Create
      // console.log("creating")
      SectionService.createNewSection(section).then(
        created => {
          if (created?.text) {
            console.log(created?.text);
          }
          // setSections(sections.concat(created));
        }
      ).catch(reason => {
        console.log(reason);
      });
    }
    // history.push('/sections'); // Make it so that it awaits success before redirect
  };

  const handleSubmitComponent: DynamicComponentCallback = (component) => {
    if (component.id) { //Edit
      dynamicComponentService.updateDynamicComponent(component).then(
        edited => {
          // setSections(sections.map(p => p.id === edited.id ? section : p));
        }
      );
    } else { //Create
      dynamicComponentService.createNewDynamicComponent(component).then(
        created => {
          if (created?.data) {
            console.log(created?.data);
          }
        }
      ).catch(reason => {
        console.log(reason);
      });
    }
    // history.push('/sections'); // Make it so that it awaits success before redirect
  };

  const handleSubmitContent: ContentCallback = (content) => {
    if (content.id) { //Edit
      contentService.updateContent(content).then(
        edited => {
          // setSections(sections.map(p => p.id === edited.id ? section : p));
        }
      );
    } else { //Create
      contentService.createNewContent(content).then(
        created => {
          if (created?.data) {
            console.log(created?.data);
          }
        }
      ).catch(reason => {
        console.log(reason);
      });
    }
    // history.push('/sections'); // Make it so that it awaits success before redirect
  };

  return (
    <React.Fragment>

      <ManagerNav />

      <Switch>
        <Route exact path={path}>
          <div>
            Sections Manager
          </div>
        </Route>
        <Route exact path={`${path}/${ManagerRoutes.Preview}`}>
          <SectionsNavEditor sections={sections} navComponent={navData} onSave={handleSubmitComponent}/>
        </Route>
        <Route exact path={`${path}/${ManagerRoutes.All}`}>
          <SectionsList sections={sections} parentURL={path} />
        </Route>
        <Route exact path={`${path}/${ManagerRoutes.AddSection}`}>
          <SectionForm section={undefined} onSubmitSection={handleSubmitSection} loadedComponents={components}/>
        </Route>
        <Route exact path={`${path}/${ManagerRoutes.EditSection}/:sectionId`}>
          <SectionForm section={undefined} onSubmitSection={handleSubmitSection} loadedComponents={components}/>
        </Route>
        <Route exact path={`${path}/${ManagerRoutes.AddComponent}`}>
          <ComponentForm component={undefined} onSubmitComponent={handleSubmitComponent} />
        </Route>
        <Route exact path={`${path}/${ManagerRoutes.EditComponent}/:componentId`}>
          <ComponentForm component={undefined} onSubmitComponent={handleSubmitComponent} />
        </Route>
        <Route exact path={`${path}/${ManagerRoutes.AddContent}`}>
          <ContentForm content={undefined} onSubmitContent={handleSubmitContent} />
        </Route>
        <Route exact path={`${path}/${ManagerRoutes.EditContent}/:contentId`}>
          <ContentForm content={undefined} onSubmitContent={handleSubmitContent} />
        </Route>
      </Switch>

    </React.Fragment>
  )
}