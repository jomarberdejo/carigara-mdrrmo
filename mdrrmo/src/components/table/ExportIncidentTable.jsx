import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from 'material-react-table';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { useNavigate } from 'react-router-dom';

const columnHelper = createMRTColumnHelper();

const columns = [
  columnHelper.accessor('report_id', {
    header: 'Report ID',
    size: 100,
  }),
  columnHelper.accessor('severity', {
    header: 'Severity',
    size: 100,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    size: 200,
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    size: 200,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 200,
  }),
  columnHelper.accessor('reported_at', {
    header: 'Reported At',
    size: 150,
  }),
  columnHelper.accessor('firstname', {
    header: 'Name',
    size: 150,
  }),
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const ExportIncidentTable = () => {
  const navigate = useNavigate()
  const fetchReports = async () => {
    const result = await axios.get('http://localhost:4000/api/reports/');
    const data = await result.data;
    const sortedIncidents = data.sort((a, b) => new Date(b.reported_at) - new Date(a.reported_at));

     
     const recentIncidents = sortedIncidents.slice(0, 10);
 
     return recentIncidents;
  };

  const { data } = useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
  });

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    enableRowSelection: true,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          onClick={() => handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <Toolbar>
        <Typography variant="h6">Recent Reported Incidents</Typography>
      </Toolbar>
      <MaterialReactTable table={table} />
      <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button size="small" onClick={()=> navigate('/incidents')}>View More</Button>
      </Toolbar>
      <Divider />
    </>
  );
};

export default ExportIncidentTable;
