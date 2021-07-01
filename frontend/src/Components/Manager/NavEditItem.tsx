import React, { useState, ReactElement, DetailedHTMLProps, HTMLAttributes, CSSProperties } from 'react';
import { Draggable, DraggingStyle, Droppable, NotDraggingStyle } from 'react-beautiful-dnd';
import { NavLink } from 'react-router-dom';
import { Section } from '../../model/section.model';

export interface Props {
    index: number;
    section: Section;
    draggableId: string;
    lists: any,
    // subItems?: NavItemData[];
    // onSearchPosts: StringCallback;
}

export class NavItemData {
    constructor(
        public id: string,
        public section: Section,
        // public subItems?: NavItemData[],
    ) { }
}

const grid = 4;

const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined): CSSProperties | undefined => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

export default function NavEditItem({ index, section, draggableId, lists, ...rest }: Props): ReactElement<Props> {
    // let droppableId=`${}`
    let key = `${section.id}-${index}`;
    // console.log(key)


    const subDropable = (droppableId: string, lists: any): ReactElement => {
        // console.log(lists[droppableId])
        return (
            <React.Fragment>
                <Droppable droppableId={droppableId}>
                    {(provided, snapshot) => (
                        <div
                            className={droppableId}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        // style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {/* {console.log(available)} */}
                            {
                                // lists[droppableId]
                                // ?
                                (lists[droppableId] as Array<NavItemData>)?.map((item, index) => (
                                    <NavEditItem index={index} draggableId={item.id} section={item.section} lists={lists} />
                                ))
                                // :(<React.Fragment />)
                            }
                        </div>
                    )}
                </Droppable>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <Draggable key={key} draggableId={`${draggableId}`} index={index} >
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                        )}
                    >
                        {section.name}
                        <div>
                            {subDropable(draggableId, lists)}
                        </div>
                    </div>
                )}
            </Draggable>
        </React.Fragment>
    )
}
const getListStyle = (isDraggingOver: boolean): CSSProperties => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
});