import { Menubar } from 'primereact/menubar';
import { useUserContext } from './../context/userContext';
import { logout } from './../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { ApiRoutes } from '../utils/constant';
import { useFetch } from '../hooks/useFetch';
import { Chip } from 'primereact/chip';

export const Navbar = () => {
  const { user, removeUser } = useUserContext();
  const navigate = useNavigate();
  const [callLogout] = useFetch(async () => {
    return await logout();
  });

  const onLogout = async () => {
    await callLogout();
    removeUser();
    navigate(ApiRoutes.LOGIN);
  }

  return (
    <>
      <div className='flex justify-content-center bg-primary-200'>
        <Menubar className='bg-primary-200 col-9 border-none' end={
          <>
            <ul className="p-menubar-root-list" role="menubar">
              <li role="none" className="p-menuitem ml-auto">
                <Chip label={user?.name} icon="pi pi-user" />
              </li>
              <li role="none" className="p-menuitem ml-3">
                <a href="#" role="menuitem" className="p-menuitem-link" aria-haspopup="false" onClick={onLogout}>
                  <span className="p-menuitem-icon pi pi-sign-out"></span>
                  <span className="p-menuitem-text">Log out</span>
                </a>
              </li>
            </ul>
          </>
        } />
      </div>
    </>
  ) 
}
