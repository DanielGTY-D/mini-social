import { isAxiosError } from "axios";
import { API } from "../../../../config/axios";

const useVerification = () => {
	const verifyAccount = async (token: string) => {
		try {
            const {data} = await API.post(`/auth/verify/${token}`)
            return data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};

	return {
        verifyAccount
    };
};

export default useVerification;
