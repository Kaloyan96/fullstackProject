import React, { useState, ReactElement, useEffect, CSSProperties } from 'react';
import { DragDropContext, DraggableLocation, Droppable, DropResult } from 'react-beautiful-dnd';
import { DynamicComponentCallback } from '../../common/common-types';
import { availableComponents, DynamicComponent } from '../DynamicComponents/dynamic-component.model';

import { Section } from '../../model/section.model';
import NavEditItem, { NavItemData } from './NavEditItem';

const default_nav_tree_name = "default_nav_tree";

interface Props {
    sections: Section[];
    navComponent: DynamicComponent | undefined;
    onSave: DynamicComponentCallback;
    onRefresh?: DynamicComponentCallback | undefined;
}

const remove = (list: NavItemData[], startIndex: number) => {
    const result = Array.from(list);
    result.splice(startIndex, 1);

    return result;
};

const reorder = (list: NavItemData[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const moveOut = (source: NavItemData[], destination: NavItemData[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
    const sourceClone = Array.from(source);
    const destClone = destination ? Array.from(destination) : [];
    console.log(inFrameIDCounter);
    const toMoveOut = new NavItemData(`${new Date().getTime()}-${inFrameIDCounter++}`, sourceClone[droppableSource.index].section);

    destClone.splice(droppableDestination.index, 0, toMoveOut);

    const result: any = {};
    result.source = sourceClone;
    result.destination = destClone;

    return result;
};

const move = (source: NavItemData[], destination: NavItemData[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
    const sourceClone = Array.from(source);
    const destClone = destination ? Array.from(destination) : [];
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: any = {};
    result.source = sourceClone;
    result.destination = destClone;

    return result;
};

const cmove = (source: NavItemData[], destination: NavItemData[], droppableSource: DraggableLocation) => {
    const sourceClone = Array.from(source);
    const destClone = destination ? Array.from(destination) : [];
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone[destClone.length] = removed;

    const result: any = {};
    result.source = sourceClone;
    result.destination = destClone;

    return result;
};

enum DefaultIDs {
    Available_ID = "availableSections",
    Current_ID = "currentSections"
}

var inFrameIDCounter = 0;

export default function SectionsNavEditor({ sections, navComponent, onSave, ...rest }: Props): ReactElement<Props> {
    const [lists, setLists] = useState<any>({})

    const fromSections = () => {
        return sections.map(s => {
            // console.log(inFrameIDCounter);
            return new NavItemData(`${new Date().getTime()}-${inFrameIDCounter++}`, s);
        });
    }

    const fromNavComponent = () => {
        let res = {}
        if (navComponent) {
            let navData = JSON.parse(navComponent.data);
            console.log(navData);
            let rootElements = navData.map((section: any) => {//change section: section
                let currentNavItem: any = navItemFromSectionID(section.sectionId);
                let currentSection = sections.find((s: Section) => s.id === section.sectionId);
                console.log(section)
                if (currentSection && typeof currentSection !== undefined && section?.subsections?.length > 0) {
                    console.log(section.subsections)
                    let secondary = section.subsections.map((id: any) => {//change section: id
                        console.log(id)
                        return navItemFromSectionID(id);
                    })
                    if (currentNavItem.id) {
                        res = { ...res, [currentNavItem.id]: secondary };
                    }
                }

                return currentNavItem;
            })
            res = { ...res, [DefaultIDs.Current_ID]: rootElements };
        }
        console.log(res);
        return res;
    }

    const navItemFromSectionID = (sectionID: string) => {
        console.log(`NavItem from ${sectionID}`)
        let currentSection = sections.find((s: Section) => s.id === sectionID);
        if (currentSection && typeof currentSection !== undefined) {
            return new NavItemData(`${new Date().getTime()}-${inFrameIDCounter++}`, currentSection);
        } else {
            return {}
        }
    }

    useEffect(() => {
        setLists({ ...lists, [DefaultIDs.Available_ID]: fromSections(), ...fromNavComponent() })
    }, [sections, navComponent])


    useEffect(() => {
        console.log(lists);
        return () => {
            // cleanup
        }
    }, [lists])

    const onDragEnd = (result: DropResult) => {
        const { source, combine, destination } = result;
        if (destination && typeof destination !== 'undefined') {
            if (source.droppableId === DefaultIDs.Available_ID && destination.droppableId === DefaultIDs.Available_ID) {
                console.log("no")
            }
            else if (source.droppableId !== DefaultIDs.Available_ID && destination.droppableId === DefaultIDs.Available_ID) {
                const items = remove(
                    lists[source.droppableId],
                    result.source.index,
                );
                setLists({ ...lists, [source.droppableId]: items });
            } else if (source.droppableId === DefaultIDs.Available_ID && destination.droppableId !== DefaultIDs.Available_ID) {
                const result = moveOut(
                    lists[source.droppableId],
                    lists[destination.droppableId],
                    source,
                    destination
                );
                setLists({ ...lists, [destination.droppableId]: result.destination });
            } else if (source.droppableId === destination.droppableId) {
                const items = reorder(
                    lists[source.droppableId],
                    source.index,
                    destination.index
                );
                setLists({ ...lists, [source.droppableId]: items });
            }
            else {
                const result = move(
                    lists[source.droppableId],
                    lists[destination.droppableId],
                    source,
                    destination
                );
                setLists({ ...lists, [destination.droppableId]: result.destination, [source.droppableId]: result.source });
            }
        }

        if (combine && typeof combine !== 'undefined') {
            const result = cmove(
                lists[source.droppableId],
                lists[combine.draggableId],
                source
            )
            console.log(result);
            if (source.droppableId === DefaultIDs.Available_ID) {
                setLists({ ...lists, [combine.draggableId]: result.destination });
            } else {
                setLists({ ...lists, [combine.draggableId]: result.destination, [source.droppableId]: result.source });
            }
        }
    }

    const handleSubmit = () => {
        let resData: any[] = [];
        lists[DefaultIDs.Current_ID].forEach((item: NavItemData) => {
            resData = [...resData, { sectionId: item.section.id, subsections: lists[item.id]?.map((item: NavItemData) => item.section.id) }]
        })
        let res: DynamicComponent;
        if (navComponent) {
            res = new DynamicComponent(navComponent.id, navComponent.name, availableComponents.TopNav, resData);// re-test for server side json parsing
        } else {
            res = new DynamicComponent("", default_nav_tree_name, availableComponents.TopNav, resData);// re-test for server side json parsing
        }
        onSave(res);
    }

    return (
        <React.Fragment>
            <div>
                Nav Bar Order.
            </div>

            <div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div>
                    Available
                    {dropableCatalog(DefaultIDs.Available_ID, lists)}
                </div>
                <div>
                    Current
                    {dropable(DefaultIDs.Current_ID, lists)}
                </div>
            </DragDropContext>
        </React.Fragment>
    )
}

const dropableCatalog = (droppableId: string, lists: any): ReactElement => {
    return (
        <Droppable droppableId={droppableId}>
            {(provided, snapshot) => (
                <div
                    className={droppableId}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                >
                    {(lists[droppableId] as Array<NavItemData>)?.map((item, index) => (
                        <NavEditItem index={index} draggableId={item.id} section={item.section} lists={lists} />
                    ))}
                </div>
            )}
        </Droppable>
    )
}

const dropable = (droppableId: string, lists: any): ReactElement => {
    return (
        <Droppable droppableId={droppableId} isCombineEnabled>
            {(provided, snapshot) => (
                <div
                    className={droppableId}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                >
                    {(lists[droppableId] as Array<NavItemData>)?.map((item, index) => (
                        <NavEditItem index={index} draggableId={item.id} section={item.section} lists={lists} />
                    ))}
                </div>
            )}
        </Droppable>
    )
}

const grid = 4;

const getListStyle = (isDraggingOver: boolean): CSSProperties => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
});