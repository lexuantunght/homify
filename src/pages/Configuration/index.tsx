import React from 'react';
import {
    useAddSpendingMethod,
    useAddSpendingType,
    useDeleteSpendingMethod,
    useDeleteSpendingType,
    useFetchSpendingMethods,
    useFetchSpendingTypes,
} from '../../controllers/ConfigController';
import LoadingMask from '../../common/components/LoadingMask';
import SpendingTypeTable from './components/SpendingTypeTable';
import SpendingMethodTable from './components/SpendingMethodTable';
import { useQueryClient } from 'react-query';

const ConfigurationPage: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: spendingTypes, isLoading: isLoadingType } =
        useFetchSpendingTypes();
    const { data: spendingMethods, isLoading: isLoadingMethod } =
        useFetchSpendingMethods();
    const { mutateAsync: addSpendingType } = useAddSpendingType();
    const { mutateAsync: deleteSpendingType } = useDeleteSpendingType();
    const { mutateAsync: addSpendingMethod } = useAddSpendingMethod();
    const { mutateAsync: deleteSpendingMethod } = useDeleteSpendingMethod();

    const onAddSpendingType = async (values: { name: string }) => {
        await addSpendingType(values);
        queryClient.invalidateQueries('spending_types');
    };

    const onDeleteSpendingType = async (id: string) => {
        await deleteSpendingType({ id });
        queryClient.invalidateQueries('spending_types');
    };

    const onAddSpendingMethod = async (values: { name: string }) => {
        await addSpendingMethod(values);
        queryClient.invalidateQueries('spending_methods');
    };

    const onDeleteSpendingMethod = async (id: string) => {
        await deleteSpendingMethod({ id });
        queryClient.invalidateQueries('spending_methods');
    };

    if (isLoadingMethod || isLoadingType) {
        return <LoadingMask />;
    }

    return (
        <div className="mt-4 w-full">
            <div className="grid lg:grid-cols-2 lg:gap-x-4 gap-y-4 lg:gap-y-0">
                <SpendingTypeTable
                    data={spendingTypes?.map((type, id) =>
                        Object.assign(type, { id: id + 1 })
                    )}
                    onAdd={onAddSpendingType}
                    onDelete={onDeleteSpendingType}
                />
                <SpendingMethodTable
                    data={spendingMethods?.map((mode, id) =>
                        Object.assign(mode, { id: id + 1 })
                    )}
                    onAdd={onAddSpendingMethod}
                    onDelete={onDeleteSpendingMethod}
                />
            </div>
        </div>
    );
};

export default ConfigurationPage;
