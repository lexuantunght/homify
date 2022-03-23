import React from 'react';
import { Fieldset } from 'primereact/fieldset';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { confirmDialog } from 'primereact/confirmdialog';
import { SpendingMethod } from '../../../common/models';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SpendingMethodTable: React.FC<{
    onAdd: CallableFunction;
    onDelete: CallableFunction;
    data?: SpendingMethod[];
}> = ({ onAdd, onDelete, data = [] }) => {
    const [showInput, setShowInput] = React.useState(false);

    const confirmDelete = (item: SpendingMethod) => {
        confirmDialog({
            message: `Bạn có chắc chắn muốn xoá hình thức chi tiêu ${item.name}?`,
            header: 'Cảnh báo',
            acceptLabel: 'Đồng ý',
            rejectLabel: 'Huỷ bỏ',
            className: 'w-4/5 md:w-1/2 lg:w-1/3',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => onDelete(item._id),
        });
    };

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Tên phương thức chi tiêu là bắt buộc'),
        }),
        onSubmit: async (values, { resetForm }) => {
            await onAdd(values);
            resetForm();
            setShowInput(false);
        },
    });

    const renderFooter = () => {
        return (
            <div>
                <Button
                    label="Huỷ"
                    icon="pi pi-times"
                    onClick={() => setShowInput(false)}
                    className="p-button-text"
                    disabled={formik.isSubmitting}
                />
                <Button
                    label="Thêm"
                    icon="pi pi-check"
                    onClick={() => formik.handleSubmit()}
                    disabled={!formik.isValid || formik.isSubmitting}
                    loading={formik.isSubmitting}
                />
            </div>
        );
    };
    return (
        <React.Fragment>
            <Fieldset legend="Phương thức chi tiêu">
                <div className="flex justify-end mb-3">
                    <Button
                        icon="pi pi-plus"
                        label="Thêm"
                        onClick={() => setShowInput(true)}
                    />
                </div>
                <DataTable
                    value={data}
                    showGridlines
                    rowHover
                    responsiveLayout="scroll"
                >
                    <Column field="id" header="#"></Column>
                    <Column field="name" header="Tên"></Column>
                    <Column
                        header="Thao tác"
                        body={(rowData: SpendingMethod) => (
                            <Button
                                icon="pi pi-trash"
                                className="p-button-text p-button-danger"
                                onClick={() => confirmDelete(rowData)}
                            />
                        )}
                    ></Column>
                </DataTable>
            </Fieldset>
            <Dialog
                header="Thêm phương thức chi tiêu"
                visible={showInput}
                className="w-4/5 md:w-2/3 lg:w-1/2"
                footer={renderFooter()}
                draggable={false}
                onHide={() => setShowInput(false)}
            >
                <form
                    className="flex flex-col mr-2"
                    onSubmit={formik.handleSubmit}
                >
                    <label htmlFor="name" className="mb-3">
                        Tên phương thức
                    </label>
                    <InputText
                        id="name"
                        name="name"
                        placeholder="Nhập tên hình thức"
                        autoFocus
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                            formik.touched.name && formik.errors.name
                                ? 'p-invalid'
                                : ''
                        }
                    />
                    <small id="name-help" className="p-error block mt-1">
                        {formik.touched.name && formik.errors.name}
                    </small>
                </form>
            </Dialog>
        </React.Fragment>
    );
};

export default SpendingMethodTable;
