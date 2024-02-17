import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import {
  useQuery,
} from '@tanstack/react-query';
import axios from 'axios'
import {useAuth} from '../../context/AuthContext'
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



const ExportUserTable = () => {
  const {token} = useAuth()
  const columnHelper = createMRTColumnHelper();


  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });
  
const columns = useMemo( () => [
 
  columnHelper.accessor('user_id', {
    header: 'ID',
    size: 30,
  }),
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
          alt= {row.original.profileImagePath ? row.original.profileImagePath : row.original.firstname.toUpperCase()}
          height={30}
          src= {row?.original.profileImagePath ? row.original.profileImagePath : row.original.firstname}
          sx={{ backgroundColor: '#EE4B2B' }} 
          loading="lazy"
          style={{ borderRadius: '50%' }}
        />
        <span>{renderedCellValue}</span>
      </Box>
    ),
  },
  columnHelper.accessor('firstname', {
    header: 'First Name',
    size: 70,
  }),
  columnHelper.accessor('lastname', {
    header: 'Last Name',
    size: 70,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    size: 30,
  }),
  columnHelper.accessor('contact', {
    header: 'Contact Number',
    size: 50,
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    size: 100,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    size: 150,
  }),
 
  columnHelper.accessor('role', {
    header: 'Role',
    size: 30,
  }),

  columnHelper.accessor('created_at', {
    header: 'Created At',
    size: 200,
  }),
])

  const navigate = useNavigate();
  const fetchUsers = async () => {
    const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    );
    const data = await result.data;
     
     const sortedUsers = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

     
     const recentUsers = sortedUsers.slice(0, 10);
 
     return recentUsers;
    
  };

  const { data } = useQuery({
    queryKey: ['users'],
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
  
    <div className={`${data?.length === 0 && "hidden"}`}>

      <Toolbar>
        <Typography variant="h6">Recent Users</Typography>
      </Toolbar>
      <MaterialReactTable table={table} />
      <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button size="small" onClick={()=> navigate('/users')}>View More</Button>
      </Toolbar>
      <Divider />
    </div>
    
  );
};

export default ExportUserTable;
