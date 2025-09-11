import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './updateUserModal.module.css'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useProfile from '../../hooks/useProfile';
import type { updatedUserInfo } from '../../models/user.model';
import { useState } from 'react';

const UpdateUserModal = ({ isOpen }: { isOpen: boolean }) => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<updatedUserInfo>(["user"]);
    const { updateProfile, uplodaProfilePhoto } = useProfile()
    const [pathURL, setPathURL] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: user?.username,
            bio: user?.bio
        }
    })

    const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadProfilePhotoMutation.mutate(e.target.files[0]);
        }
    }

    const handleUserUpdate = (formData: updatedUserInfo) => {

        if (formData.username === user?.username) {
            formData = {
                username: "",
                avatar: pathURL ? pathURL : "",
                bio: formData.bio
            }
            mutation.mutate(formData)
            return;
        }

        mutation.mutate(formData);
    }

    const uploadProfilePhotoMutation = useMutation({
        mutationFn: (file: File) => uplodaProfilePhoto(file),
        onSuccess: (data) => {
            setPathURL(data.pathUrl)
        },
        onError: (err: Error) => {
            toast.error(err.message)
        }
    })

    const mutation = useMutation({
        mutationFn: (formData: updatedUserInfo) => updateProfile(formData),
        onSuccess: (data) => {
            toast.success(data)

            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })

    return (
        <div className={`${styles['form-container']} ${isOpen && styles.active}`}>
            <form className={styles['form']} onSubmit={handleSubmit(handleUserUpdate)}>
                <legend className={styles.legend}>Actualizar perfil de usuario</legend>
                <div className={styles.field}>
                    <label className={styles['label']} htmlFor="username">Username</label>
                    <input
                        className={styles["input"]}
                        type="text"
                        placeholder='Lalo23'
                        {...register("username", {
                            required: "Este campo no puede ir vacio"
                        })}
                    />
                    {errors.username &&
                        (<p className={styles.error}>
                            {errors.username.message}
                        </p>)
                    }
                </div>
                <div className={styles.field}>
                    <label className={styles['label']} htmlFor="avatar">Avatar</label>
                    <input
                        id='avatar'
                        className={`${styles["input"]} ${styles["input--upload"]}`}
                        type="file"
                        placeholder=''
                        onChange={handleChangePhoto}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles['label']} htmlFor="bio">Biografia</label>
                    <textarea
                        className={styles["input"]}
                        placeholder='Hola yo soy...'
                        {...register("bio", {
                            required: "Este campo no puede ir vacio",
                            maxLength: {
                                message: "Extension maxima de 100 caracteres",
                                value: 100,
                            }
                        })}
                    />

                    {errors.bio &&
                        (<p className={styles.error}>
                            {errors.bio.message}
                        </p>)
                    }
                </div>

                <input className={styles.submit} type='submit' value={"Actualizar Perfil"} />
            </form>
        </div>
    )
}

export default UpdateUserModal;