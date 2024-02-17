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
  import Avatar from '@mui/material/Avatar';
  import FormControl from '@mui/material/FormControl';
  import MenuItem from '@mui/material/MenuItem';
  import Select from '@mui/material/Select';
  import TextField from '@mui/material/TextField';
  import AddIcon from '@mui/icons-material/Add';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  import VisibilityIcon from '@mui/icons-material/Visibility';
  import CheckIcon from '@mui/icons-material/Check';
  import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
  import {locationOptions} from '../../utils/locationOptions'

  import axios from 'axios';
  import {useAuth} from '../../context/AuthContext'
  import { toast } from 'react-toastify';


  const IncidentsTable = () => {
    const queryClient = useQueryClient()
    const {user, token} = useAuth()    
   
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
          size: 30,
          enableEditing: false,
        },
        {
          accessorKey: 'severity',
          header: 'Severity',
          size: 70,
          muiEditTextFieldProps: {
            required: true,
            label: "Severity (Mild/Moderate/Severe/Uncategorized)"
          }
        },
        {
          accessorKey: 'description',
          header: 'Description',
          size: 200,
          muiEditTextFieldProps: {
            required: true,
          },
        },
        {
          accessorKey: 'location',
          header: 'Location',
          size: 100,
          muiEditTextFieldProps: {
            required: true,
          },
        },
        {
          accessorKey: 'status',
          header: 'Status',
          size: 50,
          muiEditTextFieldProps: {
            required: true,
            label: 'Status (Ongoing / Pending / Resolved)',
          },
        },
        {
          accessorKey: 'reported_at',
          header: 'Reported At',
          size: 200,
          muiEditTextFieldProps: {
            
            required: true,

          },
          enableEditing: false,

        },
        {
          accessorFn: (row) => `${row.firstname} ${row.lastname}`,
          id: 'name',
          header: 'Reported By',
          size: 250,
          enableEditing: false,
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
      ],
      []
    );

    function useCreateIncident() {
     
      return useMutation({
        mutationFn: async ({values, table}) => {
  
          
         
          try {
          
            if (values.file_path && !values.file_path.type.startsWith('image/') && !values.file_path.type.startsWith('video/')) {
              toast.error('Please upload only an image or video.', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
                style: {
                  backgroundColor: '#2f2d2d',
                  color: 'white',
                },
              });
              return;
            }

            const formData = new FormData();
          formData.append('severity', values.severity);
          formData.append('description', values.description);
          formData.append('location', values.location);
          formData.append('status', values.status);
          formData.append('file_path', values.file_path);
          formData.append('user_id', values.user_id);
  
            const result = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/reports/`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${token}`
              },  
            });
            const data = await result.data;
  
            table.setCreatingRow(null);
            toast.success('Report Added Successfully.', {
              position: toast.POSITION.RIGHT,
              autoClose: 3000,
              style: {
                backgroundColor: 'green',
                color: 'white',
              
              },
             
            });
            
            queryClient.invalidateQueries(['incidents']);
            return data;
          } catch (error) {
            toast.error(`${error.response.data.error}`, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000,
              style: {
                backgroundColor: '#2f2d2d',
                color: 'white',
              },
            });
          
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
      const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/reports/`, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
       }
      )
      const data = result.data
  
      return data
    }
  
    function useGetIncidents() {
      return useQuery({
        queryKey: ['reports'],
        queryFn: getAllIncidents,
        refetchOnWindowFocus: true,
      });
    }
  
    function useUpdateIncident() {
     
     
      return useMutation({ 
        mutationFn: async ({values, table}) => {
           
        
        try {
          const result = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/reports/${values.report_id}`, values,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )
          const data = await result.data
      
  
          queryClient.invalidateQueries(['reports'])
          
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            style: {
              backgroundColor: 'green',
              color: 'white',
            },
          });
          table.setEditingRow(null); 
          return data;
        } catch (error) {
          toast.error(`Error updating reported incident:  ${error.response.data.error}`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            style: {
              backgroundColor: '#2f2d2d',
              color: 'white',
            },
          });
      
          
        }
      }
      })
    }
  
    function useDeleteIncident() {
     
      return useMutation({
        mutationFn: async (reportId) => {
        try{
          const result = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/reports/${reportId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          const data = await result.data;

          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            style: {
              backgroundColor: 'green',
              color: 'white',
            },
          });
         
        
   
          queryClient.invalidateQueries(['incidents'])
        }
catch (error) {
        toast.error(`Error updating reported incident:  ${error.response.data.error}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          style: {
            backgroundColor: '#2f2d2d',
            color: 'white',
          },
        });
      }
        }})}
    
  

    const handleResolved = async(report) => {
      
      if (report.status === 'Resolved'){
        toast.info('Nothing to changed, status already resolved.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          
        });
        return
      }

      
       try{
        const values = {
          status: "Resolved"
        }
        const result = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/reports/status/${report.report_id}`, values,  {
          headers: {
            'Authorization': `Bearer ${token}`
          }
         })
        const data = await result.data
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          style: {
            backgroundColor: 'green',
            color: 'white',
          },
        });
        queryClient.invalidateQueries(['reports'])
        return data;
      } catch (error) {
        toast.error(`Error updating reported incident:  ${error.response.data.error}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          style: {
            backgroundColor: '#2f2d2d',
            color: 'white',
          },
        });
  
       }
      
        
    }

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
    
        await createIncident({values, table});
       
      
      
    };

    const handleSaveIncident = async ({ values, table }) => {
      
    
      await updateIncident({values, table});
   
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

            <Typography variant='body1' sx={{ color: 'gray' }}>Severity (Uncategorized / Mild / Moderate/ Severe)*</Typography>
            <FormControl>

              <Select
                labelId="severity-select-label"
               
                defaultValue=""
                inputRef={severityRef}>
                <MenuItem value="Uncategorized">Uncategorized</MenuItem>
                <MenuItem value="Mild">Mild</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Severe">Severe</MenuItem>
              </Select>
            </FormControl>

            <TextField
              required
              label="Description"
              type="text"
              variant="outlined"
              inputRef={descriptionRef}
            />
             
            

              <Typography variant='body1' sx={{ color: 'gray'}}>Location*</Typography>
            <FormControl fullWidth>
                
                <Select
                  labelId="location-select-label"
                  id="location-select"
                  inputRef= {locationRef}
                  defaultValue=''
                >
                  {locationOptions.map((location, index) => (
                    <MenuItem key={index} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> 



            <Typography variant='body1' sx={{color: 'gray'}}>Status (Ongoing / Pending / Resolved)*</Typography>
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

            <Typography variant='body1' sx={{ color: 'gray' }}>Image / Video (Optional)</Typography>
            <Button sx={{border: "1px dashed gray", cursor: "pointer"}}>
            <input type="file"
              className=' p-1  cursor-pointer w-full' ref={filepathRef} />

            </Button>
          </DialogContent>
          <DialogActions>
            <MRT_EditActionButtons variant="text" table={table} row={row} />
          </DialogActions>
        </>
      ),
      renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
        <>
          <DialogTitle variant="h5">Edit Reported Incident</DialogTitle>
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
          <Tooltip title="Mark as Resolved">
            <IconButton onClick={() => handleResolved(row.original)}>
              <CheckIcon />
            </IconButton>
          </Tooltip>
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
    Report
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

