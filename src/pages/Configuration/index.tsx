import React from 'react';
import {
    useAddSpendingType,
    useDeleteSpendingType,
    useFetchSpendingMethods,
    useFetchSpendingTypes,
} from '../../controllers/ConfigController';
import LoadingMask from '../../common/components/LoadingMask';
import SpendingTypeTable from './components/SpendingTypeTable';
import SpendingMethodTable from './components/SpendingMethodTable';

const ConfigurationPage: React.FC = () => {
    const {
        data: spendingTypes,
        isLoading: isLoadingType,
        refetch: refetchSpendingType,
    } = useFetchSpendingTypes();
    const { data: spendingMethods, isLoading: isLoadingMethod } =
        useFetchSpendingMethods();
    const { mutateAsync: addSpendingType } = useAddSpendingType();
    const { mutateAsync: deleteSpendingType } = useDeleteSpendingType();

    const onAddSpendingType = async (values: { name: string }) => {
        await addSpendingType(values);
        refetchSpendingType();
    };

    const onDeleteSpendingType = async (id: string) => {
        await deleteSpendingType({ id });
        refetchSpendingType();
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
                />
            </div>
        </div>
    );
};

export default ConfigurationPage;
