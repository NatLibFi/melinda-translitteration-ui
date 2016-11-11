import React from 'react';
import classNames from 'classnames';
import '../../styles/components/marc-record-editor';
import _ from 'lodash';
import uuid from 'node-uuid';

// Until this has been merged, we are using custom version of draftjs: https://github.com/facebook/draft-js/pull/667
import {getDefaultKeyBinding, KeyBindingUtil, Modifier, convertToRaw, EditorBlock, genKey, 
  DefaultDraftBlockRenderMap, Editor, EditorState, RichUtils, ContentState, ContentBlock, CharacterMetadata} from '../vendor/draft-js';

import { Repeat, Map, List } from 'immutable';
import MarcRecord from 'marc-record-js';

function fieldAsString(field) {
  if (field.subfields) {
    const subfields = field.subfields.map(sub => `‡${sub.code}${sub.value}`).join('');
    return `${field.tag} ${field.ind1}${field.ind2} ${subfields}`;
  } else {
    return `${field.tag}    ${field.value}`;
  }
}

export class MarcEditor extends React.Component {

  static propTypes = {
    record: React.PropTypes.object,
    onFieldClick: React.PropTypes.func,
    onRecordUpdate: React.PropTypes.func.isRequired
  }
 
  constructor(props) {
    super(props);

    if (props.record) {

      const contentState = this.transformRecordToContentState(props.record);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {editorState};

    } else {
  
      const defaultContentState = ContentState.createFromText('');
      this.state = {editorState: EditorState.createWithContent(defaultContentState)};

    }

    this.onChange = (editorState, a, b, c) => {

      console.log('onChange', editorState, a, b, c);

      window.editorState = editorState;
      window.editor = this;

      var startKey = editorState.getSelection().getStartKey();
      var selectedBlock = editorState
        .getCurrentContent()
        .getBlockForKey(startKey);

      window.selectedBlock = selectedBlock;
      window.convertToRaw = convertToRaw;

      console.log('getLastChangeType', editorState.getLastChangeType());

      let nextContentState = editorState.getCurrentContent();
      
        
      if (this.state.editorState.getCurrentContent() !== editorState.getCurrentContent()) {
        console.log('contentState has changed');
          
        nextContentState = nextContentState.updateIn(['blockMap'], blockMap => {
          console.log('Updating', selectedBlock.toJS());

          let chars = this.applyStylesToFieldBlock(selectedBlock.getCharacterList(), selectedBlock.getText());

          let updatedBlock = selectedBlock
            .set('characterList', chars);
            

          return blockMap.set(selectedBlock.getKey(), updatedBlock);
        });
      }

   
      let nextEditorState = EditorState.push(editorState, nextContentState);

      this.setState({editorState: nextEditorState});

      this.debouncedRecordUpdate(nextEditorState);

    };

    this.debouncedRecordUpdate = _.debounce(editorState => {

      const raw = convertToRaw(editorState.getCurrentContent());
      const recStr = raw.blocks.map(b => b.text).join('\n');
      window.raw = raw;

      if (this._currentRecStr == recStr) {
        return;
      }

      this._currentRecStr = recStr;

      const updatedRecord = MarcRecord.fromString(recStr);
      updatedRecord.fields.forEach(field => field.uuid = uuid.v4());
      this._recordFromCurrentEditorContent = updatedRecord;
      this.props.onRecordUpdate(this._recordFromCurrentEditorContent);

    }, 150);
  }

  applyStylesToFieldBlock(chars, text) {
    if (text.length < 8) return chars;

    chars = chars
      .set(0, CharacterMetadata.applyStyle(chars.get(0), 'tag'))
      .set(1, CharacterMetadata.applyStyle(chars.get(1), 'tag'))
      .set(2, CharacterMetadata.applyStyle(chars.get(2), 'tag'))
      .set(4, CharacterMetadata.applyStyle(chars.get(4), 'ind'))
      .set(5, CharacterMetadata.applyStyle(chars.get(5), 'ind'));

    const textArray = text.split('');

    textArray.forEach((char, index) => {
      if (index < 6) return;

      const previousCharacter = index > 0 ? textArray[index-1] : null;

      if (char === '‡') {
        chars = chars.set(index, CharacterMetadata.applyStyle(chars.get(index), 'sub'));
      } else if (previousCharacter === '‡') {
        chars = chars.set(index, CharacterMetadata.applyStyle(chars.get(index), 'sub'));
      } else {
        chars = chars.set(index, CharacterMetadata.EMPTY);
      }
        /*if (chars.size > index+1) {
          chars.set(index+1, CharacterMetadata.applyStyle(chars.get(index+1), 'sub'));
        }*/
      
    });
    return chars;
  }

  componentWillReceiveProps(nextProps) {
    this.updateEditorState(nextProps.record);
  }

  updateEditorState(record) {

    if (record === this._recordFromCurrentEditorContent) {
      return;
    }
    
    if (record) {

      const contentState = this.transformRecordToContentState(record);
      const editorState = EditorState.push(this.state.editorState, contentState);

      this.setState({editorState});
    }
  }

  transformRecordToContentState(record) {
 
    const LDR = {
      tag: 'LDR',
      value: record.leader
    };

    const fields = record.fields.slice();
    fields.unshift(LDR);

    const blocks = fields.map((field) => {

      const text = fieldAsString(field);
      
      let chars = List(Repeat(CharacterMetadata.EMPTY, text.length));

      chars = this.applyStylesToFieldBlock(chars, text);

      const fieldType = field.subfields !== undefined ? 'datafield' : 'controlfield';

      const contentBlock = new ContentBlock({
        key: genKey(),
        text,
        characterList: chars,
        type: 'field',
        data: Map({ field, fieldType })
      });

      return contentBlock;
    });

    const contentState = ContentState.createFromBlockArray(blocks);

    return contentState;

  }

  handleKeyCommand(command) {
    console.log('handleKeyCommand', command);

    if (command === 'add-subfield-marker') {

      const {editorState} = this.state;
   
      var contentState = Modifier.insertText(editorState.getCurrentContent(), editorState.getSelection(), '‡', editorState.getCurrentInlineStyle(), null);
      var newEditorState = EditorState.push(editorState, contentState, 'insert-characters');
      this.onChange(EditorState.forceSelection(newEditorState, contentState.getSelectionAfter()));

      return 'handled';
    }

    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }


    return 'not-handled';
  }

  handleControlfieldInput(event, field) {
    console.log(event);
    console.log(field);
    console.log(this.state);

  }

  renderControlField(field) {

    const classes = classNames('marc-field marc-field-controlfield', {
      'wasUsed': field.wasUsed,
      'from-preferred': field.fromPreferred,
      'from-other': field.fromOther
    });

    return (
      <span key={field.uuid} className={classes}>
        <span className="tag">{field.tag}</span>
        <span className="pad">&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span className="value">{field.value}</span>
        {'\n'}
      </span>
    );
  }

  renderDataField(field) {
    const subfieldNodes = field.subfields.map(function(subfield, subfieldIndex) {

      const classes = classNames('marc-subfield', {
        'is-selected': subfield.wasUsed,
        'from-preferred': subfield.fromPreferred,
        'from-other': subfield.fromOther
      });

      return (
        <span key={subfieldIndex} className={classes}>
          <span className="marker">‡</span>
          <span className="code">{subfield.code}</span>
          <span className="value">{subfield.value}</span>
        </span>
      );
    });
    const classes = classNames('marc-field marc-field-datafield', {
      'is-selected': field.wasUsed,
      'from-preferred': field.fromPreferred,
      'from-other': field.fromOther
    });

    const i1 = field.ind1 || ' ';
    const i2 = field.ind2 || ' ';

    return (
      <span key={field.uuid} className={classes}>
        <span className="tag">{field.tag}</span>
        <span className="pad">&nbsp;</span>
        <span className="ind1">{i1}</span>
        <span className="ind2">{i2}</span>
        <span className="pad">&nbsp;</span>
        {subfieldNodes}
        {'\n'}
      </span>
    );
  }

  renderFields(record) {
    if (record === undefined) {
      return null;
    }

    const fields = _.get(record, 'fields', []).slice();
    if (record.leader) {
      fields.unshift({
        tag: 'LDR',
        value: record.leader
      });
    }

    const fieldNodes = fields.map((field) => {
      
      if (isControlField(field)) { 
        return this.renderControlField(field);
      } else {
        return this.renderDataField(field);
      } 
    });

    return (
      <div className="fieldList">
        {fieldNodes}
      </div>
    );

  }
  
  render() {
    const blockRenderMap = Map({
      'field': {
        element: 'div'
      }
    });

    const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);


    const {editorState} = this.state;

    window.editorState = editorState;

    const colorStyleMap = {
      tag: {
        color: '#448aff',
      },
      ind: {
        color: '#448aff',
      },
      sub: {
        color: '#e57373',
      }
    };

    return (<div className="marc-record-editor">
      <Editor 
        editorState={editorState} 
        onChange={this.onChange} 
        handleKeyCommand={(e) => this.handleKeyCommand(e)}
        blockRendererFn={myBlockRenderer} 
        blockRenderMap={extendedBlockRenderMap}
        customStyleMap={colorStyleMap}
        keyBindingFn={myKeyBindingFn}
        /> 
      </div>
    );
  }

  /*
   
   */
/*
  render() {
    return (
      <div className="marc-record">{this.renderFields(this.props.record)}</div>
    );
  } */

}

function isControlField(field) {
  return field.subfields === undefined;
}


function myBlockRenderer(contentBlock) {
  const type = contentBlock.getType();
  const content = contentBlock.getText();
  const key = contentBlock.getKey();

  if (type === 'field') {
    return {
      component: EditorBlock,
      editable: true,
      props: { content, key }
    };
  }
  return null;
}

const {hasCommandModifier} = KeyBindingUtil;

function myKeyBindingFn(e) {
  
  if (e.keyCode === 117) {
    return 'add-subfield-marker';
  }

  if (e.keyCode === 81 && hasCommandModifier(e)) {
    return 'add-subfield-marker';
  }
  return getDefaultKeyBinding(e);
}