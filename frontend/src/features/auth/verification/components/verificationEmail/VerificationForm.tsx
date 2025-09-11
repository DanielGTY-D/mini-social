import styles from "./verficationForm.module.css";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useVerification from "../../hooks/useVerification";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

type VerificationFormData = {
    digit1: string,
    digit2: string,
    digit3: string,
    digit4: string,
}

const VerificationForm = () => {
    const { verifyAccount } = useVerification()
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            digit1: "",
            digit2: "",
            digit3: "",
            digit4: "",
        }
    })

    const handleVerify = (formData: VerificationFormData) => {
        const token: string = Object.values(formData).join("");

        mutation.mutate(token);
    }

    const mutation = useMutation({
        mutationFn: (token: string) => verifyAccount(token),
        onSuccess: (data) => {
            toast.success(data)

            navigate('/auth/login');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    })

    return (
        <div className={styles.container} >
            <form className={styles.form} onSubmit={handleSubmit(handleVerify)}>
                <div className={styles['field-container']}>
                    <input className={styles.input} type="text" placeholder="1" {...register("digit1", { required: "Todos los compos son obligatorios" })} maxLength={1} />
                    <input className={styles.input} type="text" placeholder="2" {...register("digit2", { required: "Todos los compos son obligatorios" })} maxLength={1} />
                    <input className={styles.input} type="text" placeholder="3" {...register("digit3", { required: "Todos los compos son obligatorios" })} maxLength={1} />
                    <input className={styles.input} type="text" placeholder="4" {...register("digit4", { required: "Todos los compos son obligatorios" })} maxLength={1} />
                </div>

                <div>
                    <input className={styles.submit} type="submit" value="Verificar cuenta" />

                    {
                        errors.digit1 && (
                            <p className={styles.error}>{errors.digit1.message}</p>
                        )
                    }
                    {
                        errors.digit2 && (
                            <p className={styles.error}>{errors.digit2.message}</p>
                        )
                    }
                    {
                        errors.digit3 && (
                            <p className={styles.error}>{errors.digit3.message}</p>
                        )
                    }
                    {
                        errors.digit4 && (
                            <p className={styles.error}>{errors.digit4.message}</p>
                        )
                    }
                </div>
            </form>
        </div>
    )
}

export default VerificationForm;