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
import Avatar from '@mui/material/Avatar';
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
import { useAuth } from '../../context/AuthContext';

const UsersTable = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const {token} = useAuth()
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const contactRef = useRef();
  const ageRef = useRef();
  const locationRef = useRef();
  const emailRef = useRef();
  const roleRef = useRef();
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  const columns = useMemo(
    () => [

      {
        accessorKey: 'user_id',
        header: 'ID',
        size: 30,
        muiEditTextFieldProps: {
          disabled: true
        }
      },
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
      {
        accessorKey: 'firstname',
        header: 'First Name',
        size: 70,
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'lastname',
        header: 'Last Name',
        size: 70,
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 30,
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'contact',
        header: 'Contact Number',
        size: 50,
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'location',
        header: 'Location',
        size: 70,
        muiEditTextFieldProps: {
          required: true,
        },
      },

      {
        accessorKey: 'email',
        header: 'Email',
        size: 100,
        muiEditTextFieldProps: {
          disabled: true,
        }
      },



      {
        accessorKey: 'role',
        header: 'Role',

        size: 50,
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
        size: 200,

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

    await updateUser({ values, table });

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
        contact: contactRef.current.value,
        location: locationRef.current.value,
        email: emailRef.current.value,
        role: roleRef.current.value,
        password: passwordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
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
          required
            sx={{ marginTop: 2 }}
            label="Firstname"
            type="text"
            variant="outlined"
            inputRef={firstnameRef}
          />


          <TextField
          required
            id="lastname"
            label="Lastname"
            type="text"
            variant="outlined"
            inputRef={lastnameRef}
          />

          <TextField
          required
            id="age"
            label="Age"
            type="number"
            variant="outlined"
            inputRef={ageRef}
          />

<TextField
            id="age"
            label="Contact Number (en-PH)"
            placeholder='01234567891'
            type="tel"
            variant="outlined"
            inputRef={contactRef}
          />

          <Typography variant='body1' sx={{ color: 'gray' }}>Location*</Typography>
          <FormControl fullWidth>

            <Select
              labelId="location-select-label"
              id="location-select"
              inputRef={locationRef}
              defaultValue=''
            >
              {locationOptions.map((location, index) => (
                <MenuItem key={index} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
          required
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            inputRef={emailRef}
          />
            <Typography variant= "body2 text-gray-500">
            Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)
            </Typography>
            <Tooltip  title="Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)" placement="top-end">
            
            <TextField
                required
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
               
                inputRef={passwordRef}
              />
          </Tooltip>
          <Tooltip  title="Make sure both passwords match." placement="top-end">
<TextField
            required
            id="confirm-password"
            label="Confirm Password"
            type="password"
            variant="outlined"
            inputRef={confirmPasswordRef}
           
          />
   </Tooltip>
          <Typography variant='body1' sx={{ color: 'gray' }}>Role (User / Admin)*</Typography>
          <FormControl>

            <Select
              labelId="role-select-label"
              defaultValue=""
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
        Create
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  //CREATE hook (post new user to api)
  function useCreateUser() {
  
    return useMutation({
      mutationFn: async ({ values, table }) => {
        try {
          const result = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/`, values,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
          );
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
        const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
        );
        const data = await result.data;
        return data;
      },
      refetchOnWindowFocus: false,
    });
  }
  //UPDATE hook (put user in api)
  function useUpdateUser() {

    return useMutation({
      mutationFn: async ({ values, table }) => {


        try {
          const result = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${values.user_id}`, values,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
          )
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
     
    return useMutation({
      mutationFn: async (user_id) => {
      try{
        const result = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/${user_id}`,
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
       
      
 
        queryClient.invalidateQueries(['users'])
      }
catch (error) {
      toast.error(`Error updating reported user:  ${error.response.data.error}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        style: {
          backgroundColor: '#2f2d2d',
          color: 'white',
        },
      });
    }
      }})}



  return <MaterialReactTable

    table={table} />;
};

const UsersPageTable = () => (


  <>
    <Toolbar

    >
      <Typography

        variant="h6"
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


