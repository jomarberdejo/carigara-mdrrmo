import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import {useAuth} from '../../context/AuthContext'
import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from 'material-react-table';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import  Avatar  from '@mui/material/Avatar';



const ExportIncidentTable = () => {
  const navigate = useNavigate()
  const {token} = useAuth()
  const fetchReports = async () => {
    const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/reports/`, 
     {
      headers: {
        'Authorization': `Bearer ${token}`
      }
     }
    );
   
    const data = await result.data;
    const sortedIncidents = data.sort((a, b) => new Date(b.reported_at) - new Date(a.reported_at));

     
     const recentIncidents = sortedIncidents.slice(0, 10);
 
     return recentIncidents;
  };

  const { data } = useQuery({
    queryKey: ['reportss'],
    queryFn: fetchReports,
  });

  const columnHelper = createMRTColumnHelper();


const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});
  
const columns = useMemo(()=> [
  columnHelper.accessor('report_id', {
    header: 'Report ID',
    size: 30,
  }),
  columnHelper.accessor('severity', {
    header: 'Severity',
    size: 70,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    size: 200,
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    size: 100,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 70,
  }),
  columnHelper.accessor('reported_at', {
    header: 'Reported At',
    size: 200,
  }),
  {
    accessorFn: (row) => `${row.firstname} ${row.lastname}`,
    id: 'name',
    header: 'Reported By',
    size: 250,
    Cell: ({ renderedCellValue, row }) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Avatar
          alt= {row.original.firstname.toUpperCase()}
          height={30}
          src= {row.original.firstname}
          sx={{ backgroundColor: '#EE4B2B' }} 
          loading="lazy"
          style={{ borderRadius: '50%' }}
        />
        <span>{renderedCellValue}</span>
      </Box>
    ),
  },
] );

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

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
          onClick={handleExportData}
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
    <div className={`${data?.length === 0 && "hidden"}`}>
      <Toolbar>
        <Typography variant="h6">Recent Reported Incidents</Typography>
      </Toolbar>
      <MaterialReactTable table={table} />
      <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button size="small" onClick={()=> navigate('/incidents')}>View More</Button>
      </Toolbar>
      <Divider />
    </div>
  );
};

export default ExportIncidentTable;
