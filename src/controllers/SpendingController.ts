import { useMutation, useQuery } from 'react-query';
import { Spending } from '../common/models';
import { host } from '../utils/config/api.config';
import { postHelper, getHelper } from '../utils/helper/AxiosHelper';

export const useFetchSpendings = () => {
    return useQuery<{ spendings: Spending[]; totalPages: number }, Error>(
        ['spendings'],
        async () => {
            const res = await getHelper(`${host}/admin/spending/getAll`);
            return res.data;
        }
    );
};
