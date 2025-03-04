/*eslint-disable*/
import React from 'react';
import styled from 'styled-components';
import { TagIcon } from '../../../assets';
import { isEmpty } from 'lodash';

const TagsInputContainer = styled.div`
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
  padding: 0.5em 0.5em 0.5em 56px;
  border-radius: 3px;
  width: 100%;
  font-size: 14px;
  color: #444445;
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 40px;
  input::placeholder {
    color: ${props => props.theme.colors.grey};
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
  }
  input:focus-visible {
    outline: none;
  }
  input:focus {
    border: none;
  }
`;
const IconTag = styled.span`
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  z-index: 1;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
`;
const TagItem = styled.div`
  background-color: rgb(218, 216, 216);
  display: flex;
  padding: 0.5em 0.75em;
  border-radius: 20px;
`;
const CharacterCount = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
`;
const CloseButton = styled.button`
  height: 20px;
  width: 20px;
  background-color: rgb(48, 48, 48);
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5em;
  font-size: 18px;
  cursor: pointer;
`;
const TagsInput = styled.input`
  flex-grow: 1;
  padding: 0.5em 0;
  border: none;
  outline: none;
`;
const ClusterTagInput = ({
  tags,
  removeTag,
  inputValue,
  setInputValue,
  register,
  handleKeyDown,
  //   handleBlur
}) => {
  const tagsPlaceholder = () => {
    return isEmpty(tags.split(',').filter(tag => tag)) ? 'Cluster Tags' : '';
  };
  const handleBlur = () => {
    setInputValue('');
  };
  return (
    <>
      <label htmlFor="tags-input" className="tags-input-label">
        Cluster Tags
      </label>
      <TagsInputContainer className="tags-input-container">
        <IconTag className="icon-placeholder">
          <TagIcon />
        </IconTag>
        {tags
          .split(',')
          .filter(tag => tag)
          .map(tag => (
            <TagItem className="tag-item" key={tag}>
              <CharacterCount className="text">
                {tag.length > 10 ? `${tag.substring(0, 10)}...` : tag}
              </CharacterCount>
              <CloseButton
                className="close"
                tabIndex={0}
                onClick={() => removeTag(tag)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    removeTag(tag);
                  }
                }}
                aria-label={`Remove tag ${tag}`}
              >
                &times;
              </CloseButton>
            </TagItem>
          ))}

        <TagsInput
          type="text"
          value={inputValue}
          placeholder={tagsPlaceholder()}
          name="tags"
          {...register('tags')}
          onKeyDown={e => handleKeyDown(e)}
          onBlur={handleBlur}
          onChange={e => setInputValue(e.target.value)}
          aria-label="Add a tag"
        />

        {tags.split(',').filter(tag => tag).length >= 5 && (
          <p
            className="mb-0"
            style={{
              color: 'red',
              position: 'absolute',
              bottom: '-25px',
              left: '0px',
            }}
          >
            Tag limit reached (5 tags max)
          </p>
        )}
      </TagsInputContainer>
    </>
  );
};
export default ClusterTagInput;
