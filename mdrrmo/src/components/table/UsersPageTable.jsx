import { useMemo, useState, useRef } from 'react';

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
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';

import axios from 'axios'
import {
  
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { locationOptions } from '../../utils/locationOptions';
const UsersTable = () => {
  const navigate = useNavigate()
  
    const firstnameRef = useRef();
    const lastnameRef = useRef();
    const ageRef = useRef();
    const locationRef = useRef();
    const emailRef = useRef();
    const roleRef = useRef();
    const passwordRef = useRef()

  const columns = useMemo(
    () => [
     
        {
          accessorKey: 'user_id',
          header: 'ID',
          size: 80,
          muiEditTextFieldProps: {
            disabled: true
          }
        },
        {
          accessorKey: 'firstname',
          header: 'First Name',
          muiEditTextFieldProps: {
            required: true,
          },
        },
        {
          accessorKey: 'lastname',
          header: 'Last Name',
          muiEditTextFieldProps: {
            required: true,
          },
        },
        {
          accessorKey: 'age',
          header: 'Age',
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
          accessorKey: 'email',
          header: 'Email',
          muiEditTextFieldProps: {
            disabled: true,
          }
        },
       
        
   
        {
          accessorKey: 'role',
          header: 'Role',
         
          size: 100,
          muiEditTextFieldProps: {
            required: true,
            label: 'Role (User / Admin)',
          },
        },
        {
          accessorKey: 'created_at',
          header: 'Created At',
          muiEditTextFieldProps: {
           
            
            disabled: true,
          },
          size: 150,
          
        },
     
    ],
    [],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  //CREATE action
 
const handleCreateUser = async ({ values, table }) => {

    await createUser({ values, table });
  
};


  //UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    
    await updateUser({values, table});

  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.user_id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableFullScreenToggle: false,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
 
   
    onCreatingRowSave: () => handleCreateUser({
      values: {
        firstname: firstnameRef.current.value,
        lastname: lastnameRef.current.value,
        age: ageRef.current.value,
        location: locationRef.current.value,
        email: emailRef.current.value,
        role: roleRef.current.value,
        password: passwordRef.current.value,
      },
      table,
    }),
 
    onEditingRowSave: handleSaveUser,
   
    renderCreateRowDialogContent: ({ table, row }) => (
      <>
        <DialogTitle variant="h5">Create User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
        

          

          <TextField
            sx= {{marginTop: 2}}
            label="Firstname"
            type="text"
            variant="outlined"
            inputRef={firstnameRef}
          />

          
<TextField
            id="lastname"
            label="Lastname"
            type="text"
            variant="outlined"
            inputRef={lastnameRef}
          />

<TextField
            id="age"
            label="Age"
            type="number"
            variant="outlined"
            inputRef={ageRef}
          />

<Typography variant='body1' sx={{ color: 'gray'}}>Location*</Typography>
            <FormControl fullWidth>
                
                <Select
                  labelId="location-select-label"
                  id="location-select"
                  inputRef= {locationRef}
                  defaultValue='Balilit'
                >
                  {locationOptions.map((location, index) => (
                    <MenuItem key={index} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> 

<TextField
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            inputRef={emailRef}
          />

<TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            inputRef={passwordRef}
          />

<Typography variant='body1' sx={{ color: 'gray'}}>Role (User / Admin)*</Typography>
            <FormControl>

              <Select
                labelId="role-select-label"
                defaultValue="User"
                inputRef={roleRef}>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
           
              </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
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
      <Box 
      
      sx={{ display: 'flex', gap: '1rem' }}>
       
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="View Details">
          <IconButton onClick={() => navigate(`/user/${row.original.user_id}`)}>
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
      Create User
  </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable 
  
  table={table} />;
};

//CREATE hook (post new user to api)
function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ values, table }) => {
      try {
        const result = await axios.post('http://localhost:4000/api/users/', values);
        const data = result.data;
        
        queryClient.invalidateQueries(['users']);
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          style: {
            backgroundColor: 'green',
            color: 'white',
          },
        });
        table.setCreatingRow(null);
        return data;
      } catch (error) {
        toast.error(`Error creating user:  ${error.response.data.error}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          style: {
            backgroundColor: '#2f2d2d',
            color: 'white',
          },
        });

        
      }
    },
  });
}
//READ hook (get users from api)
function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const result = await axios.get('http://localhost:4000/api/users/');
      const data = await result.data;
      return data;
    },
    refetchOnWindowFocus: false,
  });
}
//UPDATE hook (put user in api)
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({ 
  mutationFn: async ({values, table}) => {
     
  
  try {
    const result = await axios.patch(`http://localhost:4000/api/users/${values.user_id}`, values)
    const data = await result.data
    
    queryClient.invalidateQueries(['users'])
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
    toast.error(`Error updating user:  ${error.response.data.error}`, {
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

//DELETE hook (delete user in api)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user_id) => {
      console.log(user_id)
      const result = await axios.delete(`http://localhost:4000/api/users/${user_id}`)
      const data = await result.data;
      console.log(data)
      queryClient.invalidateQueries(['users'])
    },

  });
}



const UsersPageTable = () => (


  <>
      <Toolbar
      
       >
        <Typography
       
        variant= "h6"
        >
        Manage Users 
        </Typography>
       </Toolbar>
    <UsersTable 
    
    />
    <Divider />
   </>

);

export default UsersPageTable;


