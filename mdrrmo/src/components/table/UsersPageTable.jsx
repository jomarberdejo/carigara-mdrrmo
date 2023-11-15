import { useMemo, useState } from 'react';
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
import VisibilityIcon from '@mui/icons-material/Visibility';

import axios from 'axios'
import {
  
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormControl, MenuItem, Select, TextField } from '@mui/material';

const Example = () => {
  const [validationErrors, setValidationErrors] = useState({});

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
            type: 'email',
            required: true,
          },
        },
   
        {
          accessorKey: 'role',
          header: 'Role',
         
          size: 100,
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
    [validationErrors],
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
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.id);
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
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Create New User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {/* {...internalEditComponents} or render custom edit components here */}
          <TextField
        label="First Name"
        sx={{marginTop: 2}}
        {...internalEditComponents[0].muiEditTextFieldProps} // This assumes the first field is for the first name
      />
      <TextField
        label="Last Name"
        sx={{marginTop: 2}}
        value={"Berdejo"}
        {...internalEditComponents[0].muiEditTextFieldProps} // This assumes the first field is for the first name
      />
      <Typography variant='body1' sx= {{marginLeft: 1}}>Role</Typography>
       <FormControl>
        
        <Select
          labelId="role-select-label"
          id="role-select"
          
        >
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
          <MenuItem value="option3">Option 3</MenuItem>
        </Select>
      </FormControl>

      <TextField
      id="email"
      label="Email"
      type="email"
      variant="outlined"
      
    />

<TextField
      id="password"
      label="Password"
      type="password"
      variant="outlined"
      
    />


   
<TextField
      id="location"
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
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Edit User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* {internalEditComponents} or render custom edit components here */}
          <TextField
        label="First Name"
        sx={{marginTop: 2}}
        {...internalEditComponents[0].muiEditTextFieldProps} // This assumes the first field is for the first name
      />
      <TextField
        label="Last Name"
        sx={{marginTop: 2}}
        value={"Berdejo"}
        {...internalEditComponents[0].muiEditTextFieldProps} // This assumes the first field is for the first name
      />
      <Typography variant='body1' sx= {{marginLeft: 1}}>Role</Typography>
       <FormControl>
        
        <Select
          labelId="role-select-label"
          id="role-select"
          
        >
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
          <MenuItem value="option3">Option 3</MenuItem>
        </Select>
      </FormControl>

      <TextField
      id="email"
      label="Email"
      type="email"
      variant="outlined"
      
    />



<Typography variant='body1' sx= {{marginLeft: 1}}>Location</Typography>
<FormControl>
   
        <Select
          labelId="location-select-label"
          id="location-select"
          
        >
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
          <MenuItem value="option3">Option 3</MenuItem>
        </Select>
      </FormControl>
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons 
          
          variant="text" table={table} row={row} />
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
          <IconButton onClick={() => alert(JSON.stringify(row))}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Add User
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
    mutationFn: async (user) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) => [
        ...prevUsers,
        {
          ...newUserInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
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
    mutationFn: async (user) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.map((prevUser) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
        ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (userId) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}



const UsersPageTable = () => (
  //Put this with your other react-query providers near root of your app

  <>
      <Toolbar
      
       >
        <Typography
       
        variant= "h6"
        >
        Manage Users 
        </Typography>
       </Toolbar>
    <Example 
    
    />
    <Divider />
   </>

);

export default UsersPageTable;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateUser(user) {
  return {
    firstname: !validateRequired(user.firstname)
      ? 'First Name is Required'
      : '',
    lastname: !validateRequired(user.lastname) ? 'Last Name is Required' : '',
    email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
  };
}
