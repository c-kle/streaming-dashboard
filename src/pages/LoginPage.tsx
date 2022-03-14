import axios from 'axios';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../lib/apiClient';
import { useAuth } from '../lib/hooks/useAuth';

export const LoginPage = () => {
  const { setToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

  const { mutate: login } = useMutation(auth, {
    onSuccess: ({ session_token }) => {
      setToken(session_token);

      const from = (location.state as any)?.from?.pathname || '/';

      navigate(from, { replace: true });
    },
    onError: (error) => {
      if (!axios.isAxiosError(error) || error.response?.status === 503) {
        setErrorMessage('An error occured');
      } else if (error.response?.status === 404) {
        setErrorMessage('Incorrect username or password');
      } else if (error.response?.status === 403) {
        setErrorMessage('User already logged in');
      }

      setDisplayErrorMessage(true);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const identifiant = formData.get('username') as string;
    const password = formData.get('password') as string;

    login({ identifiant, password });
  };

  return (
    <div className="chi-main__content">
      <div className="chi-grid">
        {displayErrorMessage && (
          <div className="chi-col -w--4 -o--4 -mb--2">
            <div className="chi-alert -danger -banner -close" role="alert">
              <i className="chi-alert__icon chi-icon icon-circle-warning" aria-hidden="true"></i>
              <div className="chi-alert__content">
                <p className="chi-alert__text">{errorMessage}</p>
              </div>
              <button
                className="chi-alert__close-button chi-button -icon -close"
                aria-label="Close"
                onClick={() => setDisplayErrorMessage(false)}
              >
                <div className="chi-button__content">
                  <i className="chi-icon icon-x" aria-hidden="true"></i>
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="chi-col -w--4 -o--4">
          <div className="chi-card">
            <div className="chi-card__content">
              <form onSubmit={handleSubmit}>
                <div className="chi-form__item -my--3">
                  <label className="chi-label" htmlFor="username">
                    Username
                  </label>
                  <input type="text" className="chi-input" name="username" id="username" required />
                </div>
                <div className="chi-form__item -my--3">
                  <label className="chi-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    className="chi-input"
                    name="password"
                    id="password"
                    required
                  />
                </div>
                <div className="-my--3 -d--flex -justify-content--end">
                  <input className="chi-button -primary" type="submit" value="Log in" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
