import React from 'react';
import {
  useQuery,
} from '@tanstack/react-query';
import axios from 'axios'
import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from 'material-react-table';
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
  {
    accessorFn: (row) => `${row.firstname} ${row.lastname}`,
    id: 'name',
    header: 'Name',
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
          src= {'image.png'}
          loading="lazy"
          style={{ borderRadius: '50%' }}
        />
        <span>{renderedCellValue}</span>
      </Box>
    ),
  },
  columnHelper.accessor('user_id', {
    header: 'ID',
    size: 40,
  }),
  columnHelper.accessor('firstname', {
    header: 'First Name',
    size: 120,
  }),
  columnHelper.accessor('lastname', {
    header: 'Last Name',
    size: 120,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    size: 70,
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    size: 200,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    size: 200,
  }),
 
  columnHelper.accessor('role', {
    header: 'Role',
    size: 100,
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    size: 150,
  }),
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const ExportUserTable = () => {

  const navigate = useNavigate();
  const fetchUsers = async () => {
    const result = await axios.get('http://localhost:4000/api/users/');
    const data = await result.data;
    return data;
  };

  const { data } = useQuery({
    queryKey: ['userss'],
    queryFn: fetchUsers,
  });

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
    enableRowSelection: true,
    enableFullScreenToggle: false,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
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
    <>
      <Toolbar>
        <Typography variant="h6">Recent Users</Typography>
      </Toolbar>
      <MaterialReactTable table={table} />
      <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button size="small" onClick={()=> navigate('/users')}>View More</Button>
      </Toolbar>
      <Divider />
    </>
  );
};

export default ExportUserTable;
