import { useEffect, useState } from 'react';
import { getUsers, lockUsers, removeUsers, unlockUsers } from '../services/user.service';
import { User } from '../types/user.type';
import { DataTable, DataTableSelectionChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useFetch } from './../hooks/useFetch';
import { Dialog } from 'primereact/dialog';

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [modalLockUsers, setModalLockUsers] = useState<boolean>(false);
  const [modalUnlockUsers, setModalUnlockUsers] = useState<boolean>(false);
  const [modalRemoveUsers, setModalRemoveUsers] = useState<boolean>(false);

  const [callGetUsers] = useFetch(async () => {
    return await getUsers();
  });

  const [callLockUsers] = useFetch(async () => {
    return await lockUsers(selectedUsers.map(user => user.id));
  });

  const [callUnlockUsers] = useFetch(async () => {
    return await unlockUsers(selectedUsers.map(user => user.id));
  });

  const [callRemoveUsers] = useFetch(async () => {
    return await removeUsers(selectedUsers.map(user => user.id));
  });

  const loadUsers = async () => {
    const response = await callGetUsers();
    setUsers(response.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleLockButton = async () => {
    setModalLockUsers(false);
    await callLockUsers();
    await loadUsers();
    setSelectedUsers([]);
  };

  const handleUnlockButton = async () => {
    setModalUnlockUsers(false);
    await callUnlockUsers();
    await loadUsers();
    setSelectedUsers([]);
  };

  const handleRemoveButton = async () => {
    setModalRemoveUsers(false);
    await callRemoveUsers();
    await loadUsers();
    setSelectedUsers([]);
  };

  const handleSelectionChange = (e: DataTableSelectionChangeEvent<User[]>) => {
    // @ts-expect-error
    setSelectedUsers(e.value);
  };

  const formatDate = (value: Date) => {
    return new Date(value).toLocaleDateString('UTC', {
      year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).toString();
  };

  const signupDateTemplate = (rowData: User) => {
    return formatDate(rowData.signupDate!);
  };

  const lastLoginDateTemplate = (rowData: User) => {
    return formatDate(rowData.lastLoginDate!);
  };

  const isLockTemplate = (rowData: User) => {
    return (rowData.isLock ? <li className='pi pi-lock p-error'></li> : <li className='pi pi-lock-open'></li>)
  };

  return (
    <>
      <div className='flex justify-content-center'>
        <div className='col-9 mt-4 p-4 border-1 border-primary-100 border-round-md surface-0 shadow-2'>
          <Toolbar start={
            <>
              <div className="flex flex-wrap gap-2">
                <Button label='Lock' icon='pi pi-lock' severity='warning' disabled={!selectedUsers.length} onClick={() => setModalLockUsers(true)}></Button>
                <Button label='Unlock' icon='pi pi-lock-open' severity='success' disabled={!selectedUsers.length} onClick={() => setModalUnlockUsers(true)}></Button>
                <Button label='Delete' icon='pi pi-trash' severity='danger' disabled={!selectedUsers.length} onClick={() => setModalRemoveUsers(true)}></Button>

                <Dialog header="Locking users" className='w-3' visible={modalLockUsers} onHide={() => setModalLockUsers(false)} footer={(
                  <>
                    <Button label="Cancel" icon="pi pi-times" onClick={() => setModalLockUsers(false)} className="p-button-text" />
                    <Button label="OK" icon="pi pi-check" onClick={handleLockButton} />
                  </>
                )}>
                  <p className="m-0">
                    Do you really want to lock users?
                  </p>
                </Dialog>

                <Dialog header="Unlocking users" className='w-3' visible={modalUnlockUsers} onHide={() => setModalUnlockUsers(false)} footer={(
                  <>
                    <Button label="Cancel" icon="pi pi-times" onClick={() => setModalUnlockUsers(false)} className="p-button-text" />
                    <Button label="OK" icon="pi pi-check" onClick={handleUnlockButton} />
                  </>
                )}>
                  <p className="m-0">
                    Do you really want to unlock users?
                  </p>
                </Dialog>

                <Dialog header="Deleting users" className='w-3' visible={modalRemoveUsers} onHide={() => setModalRemoveUsers(false)} footer={(
                  <>
                    <Button label="Cancel" icon="pi pi-times" onClick={() => setModalRemoveUsers(false)} className="p-button-text" />
                    <Button label="OK" icon="pi pi-check" onClick={handleRemoveButton} />
                  </>
                )}>
                  <p className="m-0">
                    Do you really want to delete users?
                  </p>
                </Dialog>
              </div>
            </>
          } />

          <DataTable className='mt-4' value={users} selectionMode='checkbox' selection={selectedUsers}
          onSelectionChange={handleSelectionChange} removableSort dataKey="id">
            <Column selectionMode="multiple"></Column>
            <Column field="id" header="Id" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="name" header="Name" sortable />
            <Column field="signupDate" header="Sign up date" sortable dataType="date" body={signupDateTemplate} />
            <Column field="lastLoginDate" header="Last login date" sortable dataType="date" body={lastLoginDateTemplate} />
            <Column field="isLock" header="Lock" sortable body={isLockTemplate} />
          </DataTable>
        </div>
      </div>
    </>
  );
}
