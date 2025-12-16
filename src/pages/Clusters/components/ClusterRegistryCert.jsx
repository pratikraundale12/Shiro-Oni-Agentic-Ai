/*eslint-disable*/
import { DownloadIcon } from '../../../assets';
import { Table } from '../../../components';
import { ACCESS_TOKEN, API_URL } from '../../../constants';

const RegistryCertificateDownloadTab = ({ clusterId }) => {
  const handleDownload = async type => {
    const response = await fetch(
      `${API_URL}/api/clusters/${clusterId}/download-certs/${type}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      }
    );
    if (response?.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      if (type !== 'registry-cert' && type !== 'password') {
        a.download = `${type}.jks`;
      } else if (type !== 'registry-cert' && type === 'password') {
        a.download = `${type}.txt`;
      } else {
        a.download = `${type}.pfx`;
      }
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  };
  const COLUMNS = [
    {
      label: 'Certificate',
      renderCell: item => (
        <div className="d-flex gap-2">{item?.certificate || 'N/A'}</div>
      ),

      resize: true,
      width: '70%',
    },

    {
      label: 'Action',
      renderCell: item => (
        <>
          {' '}
          <span
            onClick={() => handleDownload(item?.type)}
            style={{ cursor: 'pointer' }}
          >
            <DownloadIcon color="black" />
          </span>
        </>
      ),
      resize: true,
      width: '30%',
    },
  ];
  const certArr = [
    { certificate: 'Keystore Certificate', type: 'keystore' },
    { certificate: 'Trustore Certificate', type: 'truststore' },
    { certificate: 'Registry Certificate', type: 'registry-cert' },
    { certificate: 'Password', type: 'password' },
  ];
  return (
    <div className="mt-3">
      <Table
        data={certArr || []}
        columns={COLUMNS}
        customNoDataText="No Host IP Available"
        tableWithFullHeight={true}
      />
    </div>
  );
};
export default RegistryCertificateDownloadTab;
