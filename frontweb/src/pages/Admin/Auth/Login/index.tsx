import { Link, useHistory, useLocation } from 'react-router-dom';
import ButtonIcon from 'components/ButtonIcon';
import { requestBackendLogin } from 'util/requests';
import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { AuthContext } from 'AuthContext';
import './styles.css';
import { saveAuthData } from 'util/storage';
import { isAuthenticated } from 'util/auth';
import { getTokenData } from 'util/token';

type CredentialsDTO = {
  username: string;
  password: string;
};

type LocationState = {
  from: string;
};

const Login = () => {
  const location = useLocation<LocationState>();
  const { from } = location.state || { from: { pathname: '/admin' } };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsDTO>();
  const [hasError, setHasError] = useState(false);
  const history = useHistory();
  const { setAuthContextData } = useContext(AuthContext);

  const onSubmit = async (formData: CredentialsDTO) => {
    try {
      const loginRequest = await requestBackendLogin(formData);
      saveAuthData(loginRequest.data);
      setAuthContextData({
        authenticated: isAuthenticated(),
        tokenData: getTokenData(),
      });
      history.replace(from);
      setHasError(false);
    } catch (error) {
      setHasError(true);
    }
  };

  return (
    <div className="base-card login-card">
      <h1>LOGIN</h1>
      {hasError && (
        <div className="alert alert-danger">Erro ao tentar efetuar o login</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            {...register('username', {
              required: 'Campo obrigatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i,
                message: 'Email invalido',
              },
            })}
            type="text"
            className={`form-control base-input ${
              errors.username ? 'is-invalid' : ''
            }`}
            placeholder="Email"
            name="username"
          />
          <div className="invalid-feedback d-block">
            {errors.username?.message}
          </div>
        </div>
        <div className="mb-2">
          <input
            {...register('password', { required: 'Campo obrigatorio' })}
            type="password"
            className={`form-control base-input ${
              errors.password ? 'is-invalid' : ''
            }`}
            placeholder="Password"
            name="password"
          />
          <div className="invalid-feedback d-block">
            {errors.password?.message}
          </div>
        </div>
        <Link to="/admin/auth/recover" className="login-link-recover">
          Esqueci a senha
        </Link>
        <div className="login-submit">
          <ButtonIcon text="Fazer login" />
        </div>
        <div className="signup-container">
          <span className="not-registered">N??o tem Cadastro?</span>
          <Link to="/admin/auth/register" className="login-link-register">
            CADASTRAR
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
