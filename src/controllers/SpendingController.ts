import { useMutation, useQuery } from 'react-query';
import { PaginationQuery, Spending } from '../common/models';
import { host } from '../utils/config/api.config';
import {
    postHelper,
    getHelper,
    deleteHelper,
    putHelper,
} from '../utils/helper/AxiosHelper';

type SpendingFilter = {
    name?: string;
    spendingType?: string;
    spendingMethod?: string;
    fromDate?: Date | string;
    toDate?: Date | string;
};

type SpendingRequest = {
    name: string;
    spendingType: string;
    spendingMethod: string;
    spendingDate: Date;
    total: number;
};

export const useFetchSpendings = ({
    page,
    limit,
    name = '',
    spendingType = '',
    spendingMethod = '',
    fromDate = '',
    toDate = '',
}: PaginationQuery & SpendingFilter) => {
    return useQuery<{ spendings: Spending[]; totalRecords: number }, Error>(
        [
            'spendings',
            {
                page,
                limit,
                name,
                spendingType,
                spendingMethod,
                fromDate,
                toDate,
            },
        ],
        async () => {
            const res = await getHelper(
                `${host}/admin/spending/getAll?` +
                    `limit=${limit}&page=${page}&name=${name}&spendingType=${spendingType}` +
                    `&spendingMethod=${spendingMethod}&fromDate=${fromDate}&toDate=${toDate}`
            );
            return res.data;
        }
    );
};

export const useFetchSpending = ({ id }: { id: string }) => {
    return useQuery<Spending, Error>(['spending_id', { id }], async () => {
        const res = await getHelper(`${host}/admin/spending/getById/${id}`);
        return res.data;
    });
};

export const useAddSpending = () => {
    return useMutation(async (request: SpendingRequest) => {
        const res = await postHelper(`${host}/admin/spending/create`, request);
        return res;
    });
};

export const useEditSpending = () => {
    return useMutation(async (request: SpendingRequest & { id?: string }) => {
        const res = await putHelper(
            `${host}/admin/spending/${request.id}`,
            request
        );
        return res;
    });
};

export const useDeleteSpending = () => {
    return useMutation(async ({ id }: { id: string }) => {
        const res = await deleteHelper(`${host}/admin/spending/${id}`);
        return res;
    });
};
