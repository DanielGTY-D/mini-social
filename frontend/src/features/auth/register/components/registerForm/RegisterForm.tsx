import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import styles from './registerForm.module.css';
import type { auth } from '../../../../../types/auth';
import useRegister from '../../hooks/useRegister';
import { useNavigate } from 'react-router';


const RegisterForm = () => {
    const { createNewUser } = useRegister();
    const navigate = useNavigate()
    const defaultValues = {
        email: "",
        password: ""
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: defaultValues })

    // crear el usuario
    const mutation = useMutation({
        mutationFn: (data: auth) => createNewUser(data),
        onSuccess: (data) => {
            toast.success(data);

            setTimeout(() => {
                navigate("/auth/verify", {})
            }, 4000)
        },
        onError: (data: Error) => {
            toast.error(data.message);
        },
    })

    const handleRegister = (formData: auth) => {
        mutation.mutate(formData);
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit(handleRegister)}>
                <legend className={styles.legend}>Registrate</legend>
                <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>Tu Email</label>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder='email'
                        id='email'
                        {...register("email", {
                            required: "El email es obligatorio",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Este no es un email valido"
                            },

                        })}
                    />
                    {errors.email &&
                        (<p className={styles.error}>
                            {errors.email.message}
                        </p>)
                    }
                </div>
                <div className={styles.field}>
                    <label htmlFor="password" className={styles.label}>Tu password</label>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder='password'
                        id='password'
                        {...register("password", {
                            required: "El password es obligatorio",
                            maxLength: {
                                message: "Debe contener maximo 10 caracteres",
                                value: 10
                            },
                            minLength: {
                                message: "Debe contener al menos 6 caracteres",
                                value: 6
                            }
                        })}
                    />
                    {errors.password &&
                        (<p className={styles.error}>
                            {errors.password.message}
                        </p>)
                    }
                </div>

                <input className={styles.button} type='submit' value={"Registrarse"} />
            </form>

            <div>
                <a className={styles.link} href="#">Ya tienes una cuenta? <span>Inicia sesion</span></a>
            </div>
        </div>
    )
}

export default RegisterForm;