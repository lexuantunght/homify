import { useMutation, useQuery } from 'react-query';
import { SpendingMethod, SpendingType } from '../common/models';
import { host } from '../utils/config/api.config';
import {
    postHelper,
    getHelper,
    deleteHelper,
} from '../utils/helper/AxiosHelper';

export const useFetchSpendingTypes = () => {
    return useQuery<SpendingType[], Error>(['spending_types'], async () => {
        const res = await getHelper(`${host}/admin/spending-type/getAll`);
        return res.data;
    });
};

export const useFetchSpendingMethods = () => {
    return useQuery<SpendingMethod[], Error>(['spending_methods'], async () => {
        const res = await getHelper(`${host}/admin/spending-method/getAll`);
        return res.data;
    });
};

export const useAddSpendingType = () => {
    return useMutation(async ({ name }: { name: string }) => {
        const res = await postHelper(`${host}/admin/spending-type/create`, {
            name,
        });
        return res;
    });
};

export const useAddSpendingMethod = () => {
    return useMutation(async ({ name }: { name: string }) => {
        const res = await postHelper(`${host}/admin/spending-method/create`, {
            name,
        });
        return res;
    });
};

export const useDeleteSpendingType = () => {
    return useMutation(async ({ id }: { id: string }) => {
        const res = await deleteHelper(`${host}/admin/spending-type/${id}`);
        return res;
    });
};

export const useDeleteSpendingMethod = () => {
    return useMutation(async ({ id }: { id: string }) => {
        const res = await deleteHelper(`${host}/admin/spending-method/${id}`);
        return res;
    });
};
