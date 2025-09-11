import { CiImageOn } from "react-icons/ci";
import { GrDocumentUpload } from "react-icons/gr";
import { useForm } from "react-hook-form";
import styles from './createPost.module.css'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import usePost from "../../hooks/usePost";
import { toast } from "react-toastify";
import { useState } from "react";

export interface FormPost {
    content: string,
    image: string
}

const CreatePost = () => {
    const { createPost, uplodaPostImage } = usePost()
    const queryClient = useQueryClient()
    const [pathImage, setPathImage] = useState("");
    const isLogged = localStorage.getItem('AUTH_TOKEN');
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormPost>({
        defaultValues: {
            content: "",
            image: ""
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const img = e.target.files[0];
            mutationUploadImage.mutate(img);
        }
    }

    const handlePost = (formData: FormPost) => {
        formData = {
            content: formData.content,
            image: pathImage
        }
        if (isLogged) {
            mutationPost.mutate(formData);
            return
        }

        toast.error("Tienes que Iniciar sesion para comenzar a postear")
    }

    const mutationUploadImage = useMutation({
        mutationFn: (file: File) => uplodaPostImage(file),
        onSuccess: (data) => {
            setPathImage(data.pathUrl);
        },
        onError: (err: Error) => {
            toast.error(err.message);
        }
    })

    const mutationPost = useMutation({
        mutationFn: (data: FormPost) => createPost(data),
        onError: (error: Error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data);
            reset();
            queryClient.invalidateQueries({ queryKey: ["posts"] })
            setPathImage("");
        }
    })

    return (
        <div className={styles['post-container']}>
            <div className={styles['post__header']}>
                <p className={styles['username']}>Nombre de usuario</p>
            </div>

            <form className={styles["post__form"]} onSubmit={handleSubmit(handlePost)}>
                <div className={styles["post__field"]}>
                    <div className={styles["post__opts-container"]}>
                        <ul className={styles["post__opts"]}>
                            <div className={styles["post__upload-file"]}>
                                <label htmlFor="image"><li aria-label="subir image"><CiImageOn /></li></label>
                                <input type="file" id="image" onChange={handleChange} />
                            </div>
                            <li aria-label="subir documento"><GrDocumentUpload /></li>
                        </ul>
                        <label htmlFor="content">ingresa el contenido de tu post:</label>
                    </div>
                    <textarea
                        className={styles["post__content"]}
                        id="content"
                        placeholder="Hola soy nombre de usuario"
                        {...register("content", {
                            required: "No puedes postear algo vacio"
                        })}
                    ></textarea>

                    {
                        errors.content && (
                            <p className={styles["post__error"]}>{errors.content.message}</p>
                        )
                    }
                </div>

                {
                    pathImage && (
                        <div className={`${styles["post__field"]} ${styles["post__image-preview"]}`}>
                            <img className={""} src={pathImage} alt="preview" width={400} height={200} />
                        </div>
                    )
                }

                <input className={styles["post__submit"]} type="submit" value="Postear" height={"250px"} width={"100%"} />
            </form>
        </div>
    )
}

export default CreatePost;