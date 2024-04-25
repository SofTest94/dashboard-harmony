import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TablePagination,
  Typography,
  Container,
  FormHelperText,
} from '@mui/material';

import { userServices } from '../../../services/users/users';
import { specialtiesServices } from '../../../services/specialties/specialty';
import { CreateUsers, UpdateUsers, Users } from '../../types/users';
import { Specialties } from '../../types/specialties';
import { awsServices } from '../../../services/aws/aws';

const UserList = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [idSpecialty, setIdSpecialty] = useState<string>('');
  const [idBranch, setIdBranch] = useState<string>('');
  const [idRol, setIdRol] = useState<string>('');
  const [photo, setPhoto] = useState<string>('');
  const [updatePhoto, setUpdatePhoto] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [v, setV] = useState<number>(0);
  const [specialty, setSpecialty] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userServices.getAllUsers('', '', page, rowsPerPage);
        setUsers(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await specialtiesServices.getAllSpecialties('');
        setInitialSpecialties(response);
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };

    fetchSpecialties();
  }, []);

  const [initialSpecialties, setInitialSpecialties] = useState<Specialties[]>([]);

  const openModal = (userId: string, user: Users | null = null) => {
    const selectedUserData = users.find((u) => u._id === userId);
    if (selectedUserData) {
      setSelectedUser(selectedUserData);
      setSelectedUserId(userId);
      setFirstName(selectedUserData.firstName);
      setLastName(selectedUserData.lastName);
      setMiddleName(selectedUserData.middleName);
      setGender(selectedUserData.gender || '');
      setBirthday(selectedUserData.birthday || '');
      setFullName(selectedUserData.fullName);
      setIdSpecialty(selectedUserData.idSpecialty);
      setIdBranch(selectedUserData.idBranch);
      setIdRol(selectedUserData.idRol);
      setPhoto(selectedUserData.photo);
      setSelectedSpecialty(selectedUserData.idSpecialty); // Establecer el valor por defecto del Select
      setSpecialty(selectedUserData.specialty);
    } else {
      clearInputFields();
    }
    setModalOpen(true);
  };

  const handleAddUser = async () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const newUser: CreateUsers = {
        firstName,
        lastName,
        middleName,
        fullName: `${firstName} ${lastName} ${middleName}`,
        idSpecialty: selectedSpecialty,
        photo: '', // Omitimos la foto aquí ya que la enviaremos por separado
        specialty,
      };

      try {
        // Subir la foto al servicio S3
        const photoUrl: any = await awsServices.insertImgInS3(file, ''); //uploadImageToServer(file);

        // Agregar la URL de la foto al nuevo usuario
        newUser.photo = decodeURIComponent(photoUrl.fileUrl);

        // Crear el usuario con la foto y los demás datos
        await userServices.createUser(newUser, '');

        // Actualizar el estado de los usuarios
        let updatedUsers = [...users, newUser];

        setUsers(updatedUsers);

        // Limpiar los campos
        clearInputFields();

        // Cerrar el modal
        closeModal();

        // Mostrar ventana modal de éxito
        setAction('agregar');
        setSuccessOpen(true);
      } catch (error) {
        console.error('Error al agregar usuario:', error);
      }
    } else {
      console.error('No se ha seleccionado ninguna imagen.');
    }
  };

  const handleUpdateUser = async () => {
    let auxPhoto = photo;
    const containsBucketHarmony = photo.includes('bucket-harmony');

    if (!containsBucketHarmony) {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const photoUrl: any = await awsServices.insertImgInS3(file, '');
        auxPhoto = photoUrl.fileUrl;
      }
    }

    if (selectedUser) {
      const updateUser: UpdateUsers = {
        _id: selectedUser._id,
        gender,
        birthday,
        idBranch,
        idRol,
        firstName,
        lastName,
        middleName,
        fullName: `${firstName} ${lastName} ${middleName}`,
        idSpecialty: selectedSpecialty,
        photo: auxPhoto,
      };

      // jms
      await userServices.updateById(selectedUser._id, updateUser, '');

      const updatedUsers = users.map((user) =>
        user._id === selectedUser._id
          ? {
              ...user,
              firstName,
              lastName,
              middleName,
              gender,
              birthday,
              fullName: `${firstName} ${lastName} ${middleName}`,
              idSpecialty: selectedSpecialty,
              idBranch,
              idRol,
              photo,
              createdAt,
              updatedAt,
              __v: v,
              specialty,
            }
          : user
      );
      setUsers(updatedUsers);
      clearInputFields();
      closeModal();
      setAction('actualizar');
      setSuccessOpen(true);
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      const updatedUsers = users.filter((user) => user._id !== selectedUser._id);
      console.log(selectedUser._id);
      await userServices.deleteUser(selectedUser._id, '');
      setUsers(updatedUsers);
      clearInputFields();
      closeModal();
      setAction('eliminar');
      setSuccessOpen(true);
    }
  };

  const closeModal = () => {
    clearInputFields();
    setModalOpen(false);
  };

  const clearInputFields = () => {
    setSelectedUserId('');
    setFirstName('');
    setLastName('');
    setMiddleName('');
    setGender('');
    setBirthday('');
    setFullName('');
    setIdSpecialty('');
    setIdBranch('');
    setIdRol('');
    setPhoto('');
    setCreatedAt('');
    setUpdatedAt('');
    setV(0);
    setSpecialty('');
    setSelectedUser(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h3" align="center">
        Empleados
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NOMBRE COMPLETO</TableCell>
              <TableCell>ESPECIALIDAD</TableCell>
              <TableCell>FOTO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow
                key={user._id}
                onClick={() => openModal(user._id, user)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'inherit')}
              >
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.specialty}</TableCell>
                <TableCell>
                  <img src={user.photo} alt="User" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div>
        <Button variant="contained" color="primary" onClick={() => openModal(selectedUserId)}>
          +
        </Button>
      </div>
      {/* <Dialog open={modalOpen} onClose={closeModal} disableEscapeKeyDown> */}
      <Dialog
        open={modalOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            closeModal();
          }
        }}
      >
        <DialogTitle>{selectedUser ? 'Actualizar Usuario' : 'Agregar Nuevo Usuario'}</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField label="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
          </Box>
          <Box mb={2}>
            <TextField label="A. Paterno" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
          </Box>
          <Box mb={2}>
            <TextField label="A. Materno" value={middleName} onChange={(e) => setMiddleName(e.target.value)} fullWidth />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth>
              <FormHelperText>Seleccione una especialidad</FormHelperText>
              <Select
                value={selectedSpecialty}
                onChange={(e) => {
                  const selectedSpecialtyId = e.target.value as string;
                  const selectedSpecialtyName =
                    initialSpecialties.find((specialty) => specialty._id === selectedSpecialtyId)?.name || '';
                  setSelectedSpecialty(selectedSpecialtyId);
                  setSpecialty(selectedSpecialtyName); // Establecer el nombre de la especialidad en el estado specialty
                }}
              >
                {initialSpecialties.map((specialty) => (
                  <MenuItem key={specialty._id} value={specialty._id}>
                    {specialty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    if (reader.result) {
                      setPhoto(reader.result.toString());
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </Box>
          <Box mb={2}>{photo && <img src={photo} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Cancelar
          </Button>
          {selectedUser ? (
            <>
              <Button
                onClick={() => {
                  setConfirmOpen(true);
                  setAction('actualizar');
                }}
                color="primary"
                disabled={!firstName || !lastName || !selectedSpecialty}
              >
                Actualizar
              </Button>
              <Button
                onClick={() => {
                  setConfirmOpen(true);
                  setAction('eliminar');
                }}
                color="secondary"
              >
                Eliminar
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setConfirmOpen(true);
                setAction('agregar');
              }}
              color="primary"
              disabled={!firstName || !lastName || !selectedSpecialty}
            >
              Agregar
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{`¿Estás seguro que deseas ${action}?`}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (action === 'agregar') handleAddUser();
              if (action === 'eliminar') handleDeleteUser();
              if (action === 'actualizar') handleUpdateUser();
              setConfirmOpen(false);
            }}
            color="secondary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
        <DialogTitle>{`Usuario ${
          action === 'agregar' ? 'agregado' : action === 'eliminar' ? 'eliminado' : 'actualizado'
        } correctamente`}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setSuccessOpen(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default UserList;
