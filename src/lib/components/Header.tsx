import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../apiClient';
import { useAuth } from '../hooks/useAuth';

declare const chi: any;

export const Header = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const { mutate } = useMutation(apiLogout, {
    onSuccess: () => {
      setToken('');

      navigate('/login');
    },
  });
  const logout = () => mutate({ session_token: token });

  useEffect(() => {
    const dropdown = chi.dropdown(document.getElementById('profile-dropdown'));

    return () => dropdown.dispose();
  }, []);

  return (
    <header className="chi-main__header">
      <div className="chi-main__header-start">
        <div className="chi-main__title">
          <div className="-text--h3 -text--boldest -text--navy -m--0 -pr--2">Dashboard</div>
        </div>
      </div>
      <div className="chi-main__header-end">
        <div className="chi-dropdown">
          <button
            id="profile-dropdown"
            className="chi-dropdown__trigger -animate chi-button -icon -flat"
            aria-label="Profile"
            data-tooltip="Profile"
          >
            <div className="chi-button__content">
              <i className="chi-icon icon-circle-user -md" aria-hidden="true"></i>
            </div>
          </button>
          <div className="chi-dropdown__menu">
            <span className="chi-dropdown__menu-item">Profile</span>
            <div className="chi-divider"></div>
            <button className="chi-dropdown__menu-item chi-button -flat" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
