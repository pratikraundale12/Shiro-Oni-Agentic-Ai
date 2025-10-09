import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Table, TextRender, UrlRender } from '../../../components';
import { KDFM } from '../../../constants';
import { LockIcon } from '../../../assets';
import { theme } from '../../../styles';
import { Tooltip as ReactTooltip } from 'react-tooltip';
const Container = styled.div`
  .customTable {
    height: auto;
  }
`;
const RegistryDetail = ({ data, displayFullWidth }) => {
  const REGISTRYCOLUMNS = [
    {
      label: KDFM.REGISTRY_NAME,
      renderCell: item => (
        <>
          <div className="d-flex">
            <TextRender text={item.name} tooltipPlacement="right" /> &nbsp;
            {item?.is_default && (
              <>
                <span data-tooltip-id={`default-registry`}>
                  <LockIcon
                    color={theme.colors.primary}
                    width={20}
                    height={20}
                  />{' '}
                </span>
                <ReactTooltip
                  id={`default-registry`}
                  place="right"
                  effect="solid"
                  content={'Default Registry'}
                  style={{
                    width: '140px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    zIndex: 10000,
                  }}
                />
              </>
            )}
          </div>
        </>
      ),
      width: '25%',
    },
    {
      label: KDFM.REGISTRY_URL,
      renderCell: item => (
        <UrlRender
          tooltipId={'registry-url-tooltip'}
          key={item.registry_url}
          url={
            item?.registry_url?.includes('/nifi-registry')
              ? item.registry_url
              : `${item.registry_url}/nifi-registry`
          }
          tooltipPlacement="top"
          type="Registry"
          copy_btn_tooltip={'Copy Registry URL'}
        />
      ),
      width: '75%',
    },
  ];

  return (
    <Container className={`${displayFullWidth ? 'col-12' : 'col-6'} mt-2`}>
      <Table
        data={data || []}
        columns={REGISTRYCOLUMNS}
        className={'customTable'}
      />
    </Container>
  );
};

RegistryDetail.propTypes = {
  data: PropTypes.object.isRequired,
  displayFullWidth: PropTypes.bool,
};

export default RegistryDetail;
