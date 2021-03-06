import React from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { confirmDialog } from 'primereact/confirmdialog';
import { Paginator, PaginatorPageState } from 'primereact/paginator';
import Expand from 'react-expand-animated';
import {
    useAddSpending,
    useDeleteSpending,
    useEditSpending,
    useFetchSpendings,
} from '../../controllers/SpendingController';
import LoadingMask from '../../common/components/LoadingMask';
import moment from 'moment';
import paginator from '../../common/paginator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/redux/store';
import DispatchType from '../../common/constants/DispatchType';
import { useFormik } from 'formik';
import {
    useFetchSpendingMethods,
    useFetchSpendingTypes,
} from '../../controllers/ConfigController';
import { Spending } from '../../common/models';
import { useQueryClient } from 'react-query';
import AddSpendingDialog from './components/AddSpendingDialog';
import EditSpendingDialog from './components/EditSpendingDialog';
import _sumBy from 'lodash/sumBy';

const SpendingPage: React.FC = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const page = useSelector((state: RootState) => state.spending.page);
    const limit = useSelector((state: RootState) => state.spending.limit);
    const queryData = useSelector(
        (state: RootState) => state.spending.queryData
    );
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const { data: dataSpending, isLoading: isLoadingSpending } =
        useFetchSpendings({
            page,
            limit,
            ...queryData,
        });
    const { data: spendingTypes, isLoading: isLoadingSpendingTypes } =
        useFetchSpendingTypes();
    const { data: spendingMethods, isLoading: isLoadingSpendingMethods } =
        useFetchSpendingMethods();
    const { mutateAsync: deleteSpending } = useDeleteSpending();
    const { mutateAsync: addSpending } = useAddSpending();
    const { mutateAsync: editSpending } = useEditSpending();
    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [editingSpending, setEditingSpending] = React.useState<
        Spending | undefined
    >();

    const onChangePage = (e: PaginatorPageState) => {
        dispatch({ type: DispatchType.SPENDING.PAGE, data: e.page });
        dispatch({ type: DispatchType.SPENDING.LIMIT, data: e.rows });
    };

    const onAddSpending = async (values: any) => {
        await addSpending(values);
        await queryClient.invalidateQueries('spendings');
    };

    const onEditSpending = async (values: any) => {
        await editSpending(values);
        await queryClient.invalidateQueries('spendings');
    };

    const confirmDelete = (item: Spending) => {
        confirmDialog({
            message: `B???n c?? ch???c ch???n mu???n xo?? chi ti??u ${item.name}?`,
            header: 'C???nh b??o',
            acceptLabel: '?????ng ??',
            rejectLabel: 'Hu??? b???',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            className: 'w-4/5 md:w-1/2 lg:w-1/3',
            accept: async () => {
                await deleteSpending({ id: item._id });
                queryClient.invalidateQueries('spendings');
            },
        });
    };

    const formik = useFormik({
        initialValues: queryData,
        onSubmit: (values, { setSubmitting }) => {
            if (showAdvanced) {
                dispatch({ type: DispatchType.SPENDING.QUERY, data: values });
            } else {
                dispatch({
                    type: DispatchType.SPENDING.QUERY,
                    data: Object.assign(values, {
                        spendingMethod: '',
                        spendingType: '',
                        fromDate: '',
                        toDate: '',
                    }),
                });
            }
            setSubmitting(false);
        },
        onReset: (values) =>
            dispatch({ type: DispatchType.SPENDING.QUERY, data: values }),
    });

    const renderFooter = React.useCallback(() => {
        return (
            <span>
                T???ng ti???n tr??n trang:{' '}
                {dataSpending
                    ? _sumBy(dataSpending.spendings, 'total').toLocaleString()
                    : 0}
            </span>
        );
    }, [dataSpending]);

    React.useEffect(() => {
        if (editingSpending) {
            setShowEditDialog(true);
        }
    }, [editingSpending]);

    if (
        isLoadingSpending ||
        isLoadingSpendingMethods ||
        isLoadingSpendingTypes
    ) {
        return <LoadingMask />;
    }

    return (
        <div className="mt-4 w-full">
            <Fieldset legend="Danh s??ch chi ti??u">
                <div className="flex justify-end">
                    <Button
                        icon="pi pi-plus"
                        label="Th??m chi ti??u"
                        onClick={() => setShowAddDialog(true)}
                    />
                </div>
                <Divider />
                <form className="mb-10 mt-3" onSubmit={formik.handleSubmit}>
                    <Expand open={showAdvanced} duration={300}>
                        <div className="grid lg:grid-cols-4 gap-3">
                            <div className="flex space-x-3 items-center lg:col-span-2">
                                <label htmlFor="fromDate" className="w-24">
                                    Kho???ng ng??y
                                </label>
                                <div className="flex lg:flex-row flex-col items-center lg:space-x-3 space-y-1 lg:space-y-0">
                                    <Calendar
                                        inputId="fromDate"
                                        name="fromDate"
                                        className="w-44 md:w-auto"
                                        readOnlyInput
                                        showIcon
                                        value={formik.values.fromDate}
                                        onChange={(e) => {
                                            formik.setFieldValue(
                                                'fromDate',
                                                e.value
                                            );
                                            if (!formik.values.toDate) {
                                                formik.setFieldValue(
                                                    'toDate',
                                                    e.value
                                                );
                                            }
                                        }}
                                        onBlur={formik.handleBlur}
                                        maxDate={formik.values.toDate}
                                    />
                                    <span>-</span>
                                    <Calendar
                                        inputId="toDate"
                                        name="toDate"
                                        className="w-44 md:w-auto"
                                        readOnlyInput
                                        showIcon
                                        value={formik.values.toDate}
                                        onChange={(e) => {
                                            formik.setFieldValue(
                                                'toDate',
                                                e.value
                                            );
                                            if (!formik.values.fromDate) {
                                                formik.setFieldValue(
                                                    'fromDate',
                                                    e.value
                                                );
                                            }
                                        }}
                                        onBlur={formik.handleBlur}
                                        minDate={formik.values.fromDate}
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-3 items-center lg:justify-center">
                                <label htmlFor="spendingType" className="w-24">
                                    Lo???i chi ti??u
                                </label>
                                <Dropdown
                                    name="spendingType"
                                    inputId="spendingType"
                                    className="w-44 md:w-auto"
                                    options={spendingTypes}
                                    optionLabel="name"
                                    optionValue="name"
                                    value={formik.values.spendingType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className="flex space-x-3 items-center lg:justify-end">
                                <label
                                    htmlFor="spendingMethod"
                                    className="w-24"
                                >
                                    Ph????ng th???c
                                </label>
                                <Dropdown
                                    name="spendingMethod"
                                    inputId="spendingMethod"
                                    className="w-44 md:w-auto"
                                    options={spendingMethods}
                                    optionLabel="name"
                                    optionValue="name"
                                    value={formik.values.spendingMethod}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>
                    </Expand>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-end lg:space-x-10 mt-3 space-y-3 lg:space-y-0">
                        <div className="flex space-x-3 items-center">
                            <label htmlFor="name" className="w-24">
                                T??n chi ti??u
                            </label>
                            <InputText
                                id="name"
                                name="name"
                                className="w-44 md:w-auto"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div className="space-x-3">
                            <Button
                                type="submit"
                                icon="pi pi-search"
                                className="w-max"
                                label="T??m ki???m"
                                loading={formik.isSubmitting}
                            />
                            <Button
                                type="button"
                                icon="pi pi-times"
                                className="w-max p-button-secondary"
                                onClick={() => formik.resetForm()}
                            />
                        </div>
                    </div>
                    <div className="flex space-x-3 lg:justify-end mt-4">
                        <Checkbox
                            inputId="advanced"
                            checked={showAdvanced}
                            onChange={(e) => setShowAdvanced(e.checked)}
                        />
                        <label htmlFor="advanced">N??ng cao</label>
                    </div>
                </form>
                <DataTable
                    value={dataSpending?.spendings.map((spending, id) =>
                        Object.assign(spending, {
                            id: id + 1 + page * limit,
                        })
                    )}
                    showGridlines
                    emptyMessage="Kh??ng c?? d??? li???u"
                    rowHover
                    stripedRows
                    responsiveLayout="stack"
                    footer={renderFooter}
                >
                    <Column field="id" header="#"></Column>
                    <Column field="name" header="T??n"></Column>
                    <Column
                        field="spending_type"
                        header="Lo???i chi ti??u"
                    ></Column>
                    <Column
                        field="spending_method"
                        header="Ph????ng th???c"
                    ></Column>
                    <Column
                        field="spending_date"
                        header="Ng??y chi ti??u"
                        body={(rowData) =>
                            moment(rowData.spending_date).format('yyyy-MM-DD')
                        }
                    ></Column>
                    <Column
                        field="total"
                        header="S??? ti???n"
                        body={(rowData) => rowData.total?.toLocaleString()}
                    ></Column>
                    <Column
                        header="Thao t??c"
                        body={(rowData) => (
                            <>
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-text p-button-success"
                                    onClick={() => setEditingSpending(rowData)}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-text p-button-danger"
                                    onClick={() => confirmDelete(rowData)}
                                />
                            </>
                        )}
                    ></Column>
                </DataTable>
                <Paginator
                    className="mt-3"
                    template={paginator}
                    rows={limit}
                    first={limit * page}
                    totalRecords={dataSpending?.totalRecords}
                    onPageChange={onChangePage}
                />
            </Fieldset>
            <AddSpendingDialog
                show={showAddDialog}
                onHide={() => setShowAddDialog(false)}
                spendingTypes={spendingTypes}
                spendingMethods={spendingMethods}
                onAdd={onAddSpending}
            />
            <EditSpendingDialog
                show={showEditDialog}
                spending={editingSpending}
                onHide={() => {
                    setShowEditDialog(false);
                    setEditingSpending(undefined);
                }}
                spendingMethods={spendingMethods}
                spendingTypes={spendingTypes}
                onEdit={onEditSpending}
            />
        </div>
    );
};

export default SpendingPage;
