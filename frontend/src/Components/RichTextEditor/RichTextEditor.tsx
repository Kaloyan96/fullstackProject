import React, { FC } from 'react';
import Draft ,{ EditorState, RichUtils, convertToRaw } from 'draft-js';
// import { DraftEditorCommand, RawDraftContentState, DraftHandleValue } from 'draft-js';
// import { stateToHTML } from "draft-js-export-html";
// import Draft, { htmlToDraft, draftToHtml, EmptyState, rawToDraft, draftToRaw, draftStateToHTML } from 'react-wysiwyg-typescript'; // PHASE THIS OUT!!!
import { Editor } from 'react-draft-wysiwyg';

interface Props {
    editorState: EditorState;
    // editorState: RawDraftContentState // fix once you find mutable/immutable editorState
    onChange: (field: string, value: any, shouldValidate?: boolean | undefined) => void // fix once you find the callback
    // onBlur=handleBlur
}

export const RichTextEditor: FC<Props> = ({ editorState, onChange }) => {
    let onEditorStateChange = (_editorState: EditorState) => {
        // console.log(convertToRaw(_editorState.getCurrentContent()));

        return onChange('editorState', _editorState);
    };


    let className = 'RichEditor-editor';
    // var contentState = editorState.getCurrentContent();

    return (
        <div className="RichEditor-root">
            <div className={className}>
                <Editor
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    placeholder="Tell a story..."
                />
            </div>
        </div>
    );
};
