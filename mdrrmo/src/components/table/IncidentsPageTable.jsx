  import React, { useMemo, useRef, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
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
  import AddIcon from '@mui/icons-material/Add';


  import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  import VisibilityIcon from '@mui/icons-material/Visibility';
  import axios from 'axios';
  import { FormControl, MenuItem, Select, TextField } from '@mui/material';
  import {useAuth} from '../../context/AuthContext'

  const IncidentsTable = () => {
    const {user} = useAuth()
    
    const severityRef = useRef('');
    const descriptionRef = useRef();
    const locationRef = useRef();
    const statusRef = useRef();
    const filepathRef = useRef();






    const navigate = useNavigate()
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
            label: "Severity (Mild/Severe/Uncategorized)"
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
          accessorKey: 'status',
          header: 'Status',
          muiEditTextFieldProps: {
            required: true,
            label: 'Status (Ongoing / Pending / Resolved)',
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
      []
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
      
      
      await createIncident(values);
      table.setCreatingRow(null);
    };

    const handleSaveIncident = async ({ values, table }) => {
      
    
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

      onCreatingRowSave: () => handleCreateIncident({
        values: {
          severity: severityRef.current.value,
          description: descriptionRef.current.value,
          location: locationRef.current.value,
          status: statusRef.current.value,
          file_path: filepathRef.current.files[0],
          user_id: user.user_id,
        },
        table,
      }),
 
      onEditingRowSave: handleSaveIncident,
      renderCreateRowDialogContent: ({ table, row }) => (
        <>
          <DialogTitle variant="h5">
           Report New Incident
          </DialogTitle>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {/* {internalEditComponents} */}
            {/* <TextField
          label="Report ID"
          sx={{marginTop: 2}}
          {...internalEditComponents[0].muiEditTextFieldProps} // This assumes the first field is for the first name
        /> */}

            <Typography variant='body1' sx={{ marginLeft: 1 }}>Severity (Uncategorized / Mild / Severe)</Typography>
            <FormControl>

              <Select
                labelId="severity-select-label"
               
                defaultValue="Uncategorized"
                inputRef={severityRef}>
                <MenuItem value="Uncategorized">Uncategorized</MenuItem>
                <MenuItem value="Mild">Mild</MenuItem>
                <MenuItem value="Severe">Severe</MenuItem>
              </Select>
            </FormControl>

            <TextField

              label="Description"
              type="text"
              variant="outlined"
              inputRef={descriptionRef}
            />

            <input type="file"
              className='border border-dashed border-2 border-gray-600 px-2 py-1 cursor-pointer' ref={filepathRef} />


            <TextField
              id="location"
              label="Location"
              type="text"
              variant="outlined"
              inputRef={locationRef}
            />



            <Typography variant='body1' sx={{ marginLeft: 1 }}>Status (Ongoing / Pending / Resolved)</Typography>
            <FormControl>

              <Select
                labelId="status-select-label"
                defaultValue="Ongoing"
                inputRef={statusRef}>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <MRT_EditActionButtons variant="text" table={table} row={row} />
          </DialogActions>
        </>
      ),
      renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
        <>
          <DialogTitle variant="h5">Edit User</DialogTitle>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {internalEditComponents} {/* or render custom edit components here */}
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
            <IconButton onClick={() => navigate(`/incident/${row.original.report_id}`)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      renderTopToolbarCustomActions: ({ table }) => (
        <Button
    variant="contained"
    startIcon={<AddIcon />}
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

        const formData = new FormData();
        formData.append('severity', incident.severity);
        formData.append('description', incident.description);
        formData.append('location', incident.location);
        formData.append('status', incident.status);
        formData.append('file_path', incident.file_path);
        formData.append('user_id', incident.user_id);
        console.log(incident)
        try {
          const result = await axios.post('http://localhost:4000/api/reports/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const data = await result.data;

          console.log(data);
          queryClient.invalidateQueries(['incidents']);
        } catch (err) {
          console.error(err);
        }
      },
      // onMutate: (newIncidentInfo) => {
      //   queryClient.setQueryData(['incidents'], (prevIncidents) => [
      //     ...prevIncidents,
      //     {
      //       ...newIncidentInfo,
      //       report_id: (Math.random() + 1).toString(36).substring(7),
      //     },
      //   ]);
      // },
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
        const result = await axios.patch(`http://localhost:4000/api/reports/${incident.report_id}`, incident)
        const data = await result.data
    

        queryClient.invalidateQueries(['reports'])
      },

    });
  }

  function useDeleteIncident() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (reportId) => {
        console.log(reportId)
        const result = await axios.delete(`http://localhost:4000/api/reports/${reportId}`)
        const data = await result.data;
 
        queryClient.invalidateQueries(['incidents'])
      },

    });
  }

  const IncidentsPageTable = () => (
    <>
      <Toolbar>
        <Typography variant="h6">Manage Incidents</Typography>
      </Toolbar>
      <IncidentsTable />
      <Divider />
    </>
  );

  export default IncidentsPageTable;

