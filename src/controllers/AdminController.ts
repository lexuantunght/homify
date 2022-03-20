import { useMutation, useQuery } from 'react-query';
import { LoginData, UserData } from '../common/models';
import { host } from '../utils/config/api.config';
import { postHelper, getHelper } from '../utils/helper/AxiosHelper';
import CookiesHelper from '../utils/helper/CookiesHelper';

export const useLogin = () => {
    return useMutation(async ({ username, password }: LoginData) => {
        const res = await postHelper(`${host}/user/signin`, {
            username,
            password,
        });
        if (res.status === 'success') {
            await CookiesHelper.set('token', res.data.accessToken);
        }
        return res.data as UserData;
    });
};

export const useFetchCurrent = () => {
    return useQuery<UserData, Error>(['posts'], async () => {
        const res = await getHelper(`${host}/user/current`);
        return res.data;
    });
};
