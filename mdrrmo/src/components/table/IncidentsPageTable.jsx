import React, { useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { FormControl, Input, MenuItem, Select, TextField } from '@mui/material';

const Example = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: 'report_id',
        header: 'Report ID',
        size: 80,
        enableEditing: false,
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
        muiEditTextFieldProps: {
          required: true,
          
        }
      },
      {
        accessorKey: 'description',
        header: 'Description',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'location',
        header: 'Location',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      
      {
        accessorKey: 'reported_at',
        header: 'Reported At',
        muiEditTextFieldProps: {
          type: 'datetime-local',
          required: true,
          
        },
        enableEditing: false,
      
      },
      {
        accessorKey: 'firstname',
        header: 'Name',
        muiEditTextFieldProps: {
          required: true,
          
        },
        enableEditing: false,
      },
    ],
    [validationErrors]
  );

  const { mutateAsync: createIncident, isPending: isCreatingIncident } =
    useCreateIncident();
  const {
    data: fetchedIncidents = [],
    isError: isLoadingIncidentsError,
    isFetching: isFetchingIncidents,
    isLoading: isLoadingIncidents,
  } = useGetIncidents();
  const { mutateAsync: updateIncident, isPending: isUpdatingIncident } =
    useUpdateIncident();
  const { mutateAsync: deleteIncident, isPending: isDeletingIncident } =
    useDeleteIncident();

  const handleCreateIncident = async ({ values, table }) => {
    const newValidationErrors = validateIncident(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createIncident(values);
    table.setCreatingRow(null);
  };

  const handleSaveIncident = async ({ values, table }) => {
    const newValidationErrors = validateIncident(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateIncident(values);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      deleteIncident(row.original.report_id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedIncidents,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    enableFullScreenToggle: false,
    getRowId: (row) => row.report_id,
    muiToolbarAlertBannerProps: isLoadingIncidentsError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateIncident,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveIncident,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Report New Incident</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {/* {internalEditComponents} */}
          <TextField
        label="Report ID"
        sx={{marginTop: 2}}
        {...internalEditComponents[0].muiEditTextFieldProps} // This assumes the first field is for the first name
      />
     
      <Typography variant='body1' sx= {{marginLeft: 1}}>Severity</Typography>
       <FormControl>
        
        <Select
          labelId="severity-select-label"
          id="severity-select"
          value={'option1'}
        >
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
          <MenuItem value="option3">Option 3</MenuItem>
        </Select>
      </FormControl>

      <TextField
      id="text"
      label="Description"
      type="text"
      variant="outlined"
      
    />

    <input type="file" 
    className='border border-dashed border-2 border-gray-600 px-2 py-1 cursor-pointer' />
     
    
     <TextField
      id="text"
      label="Location"
      type="text"
      variant="outlined"
      
    />
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Edit Incident</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* {internalEditComponents} */}
          <FormControl>
           
      <Typography variant='body1' sx= {{marginLeft: 1}}>Severity</Typography>
        <Select
          labelId="severity-select-label"
          id="severity-select"
          value={'option1'}
        >
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
          <MenuItem value="option3">Option 3</MenuItem>
        </Select>
      </FormControl>

      <TextField
      id="text"
      label="Description"
      type="text"
      variant="outlined"
      
    />
    <TextField
      id="text"
      label="Location"
      type="text"
      variant="outlined"
      
    />
   
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="View Details">
          <IconButton onClick={() => console.log(row.original)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Report New Incident
      </Button>
    ),
    state: {
      isLoading: isLoadingIncidents,
      isSaving: isCreatingIncident || isUpdatingIncident || isDeletingIncident,
      showAlertBanner: isLoadingIncidentsError,
      showProgressBars: isFetchingIncidents,
    },
  });

  return <MaterialReactTable table={table} />;
};

function useCreateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (incident) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (newIncidentInfo) => {
      queryClient.setQueryData(['incidents'], (prevIncidents) => [
        ...prevIncidents,
        {
          ...newIncidentInfo,
          report_id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
  });
}

const getAllIncidents = async () => {
  const result = await axios.get('http://localhost:4000/api/reports/')
  const data = result.data

  return data
}

function useGetIncidents() {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: getAllIncidents,
    refetchOnWindowFocus: false,
  });
}

function useUpdateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (incident) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (newIncidentInfo) => {
      queryClient.setQueryData(['incidents'], (prevIncidents) =>
        prevIncidents?.map((prevIncident) =>
          prevIncident.report_id === newIncidentInfo.report_id
            ? newIncidentInfo
            : prevIncident
        )
      );
    },
  });
}

function useDeleteIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reportId) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (reportId) => {
      queryClient.setQueryData(['incidents'], (prevIncidents) =>
        prevIncidents?.filter((incident) => incident.report_id !== reportId)
      );
    },
  });
}

const IncidentsPageTable = () => (
  <>
    <Toolbar>
      <Typography variant="h6">Manage Incidents</Typography>
    </Toolbar>
    <Example />
    <Divider />
  </>
);

export default IncidentsPageTable;

const validateRequired = (value) => !!value.length;


function validateIncident(incident) {
  return {
    severity: !validateRequired(incident.severity) ? 'Severity is Required' : '',
    description: !validateRequired(incident.description) ? 'Description is Required' : '',
   
  };
}
