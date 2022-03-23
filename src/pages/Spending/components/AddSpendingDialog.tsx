import React from 'react';
import * as Yup from 'yup';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useFormik } from 'formik';
import { SpendingMethod, SpendingType } from '../../../common/models';
import { Calendar } from 'primereact/calendar';

const AddSpendingDialog: React.FC<{
    show?: boolean;
    onHide: () => void;
    onAdd: CallableFunction;
    spendingTypes?: SpendingType[];
    spendingMethods?: SpendingMethod[];
}> = ({ show, onHide, onAdd, spendingTypes, spendingMethods }) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            spendingType: '',
            spendingMethod: '',
            total: 0,
            spendingDate: new Date(),
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Tên chi tiêu là bắt buộc'),
            spendingMethod: Yup.string().required('Phương thức là bắt buộc'),
            spendingType: Yup.string().required('Loại chi tiêu là bắt buộc'),
            total: Yup.number()
                .min(0, 'Số tiền tối thiểu là 0')
                .required('Tổng số tiền là bắt buộc'),
            spendingDate: Yup.date().required('Ngày chi tiêu là bắt buộc'),
        }),
        onSubmit: async (values, { resetForm }) => {
            await onAdd(values);
            resetForm();
            onHide();
        },
    });

    const renderFooter = () => {
        return (
            <div>
                <Button
                    label="Huỷ"
                    type="button"
                    icon="pi pi-times"
                    onClick={onHide}
                    className="p-button-text"
                    disabled={formik.isSubmitting}
                />
                <Button
                    label="Thêm"
                    type="button"
                    icon="pi pi-check"
                    onClick={() => formik.handleSubmit()}
                    disabled={!formik.isValid || formik.isSubmitting}
                    loading={formik.isSubmitting}
                />
            </div>
        );
    };

    return (
        <Dialog
            header="Thêm chi tiêu"
            visible={show}
            className="w-4/5 md:w-2/3 lg:w-1/2"
            footer={renderFooter()}
            draggable={false}
            onHide={onHide}
        >
            <form className="flex flex-col mr-2" onSubmit={formik.handleSubmit}>
                <label htmlFor="name" className="mb-3">
                    Tên chi tiêu
                </label>
                <InputText
                    id="name"
                    name="name"
                    placeholder="Nhập tên chi tiêu"
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
                <label htmlFor="spendingType" className="my-3">
                    Loại chi tiêu
                </label>
                <Dropdown
                    name="spendingType"
                    inputId="spendingType"
                    options={spendingTypes}
                    optionLabel="name"
                    optionValue="name"
                    value={formik.values.spendingType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <small id="spendingType-help" className="p-error block mt-1">
                    {formik.touched.spendingType && formik.errors.spendingType}
                </small>
                <label htmlFor="spendingMethod" className="my-3">
                    Phương thức chi tiêu
                </label>
                <Dropdown
                    name="spendingMethod"
                    inputId="spendingMethod"
                    options={spendingMethods}
                    optionLabel="name"
                    optionValue="name"
                    value={formik.values.spendingMethod}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <small id="spendingMethod-help" className="p-error block mt-1">
                    {formik.touched.spendingMethod &&
                        formik.errors.spendingMethod}
                </small>
                <label htmlFor="spendingDate" className="my-3">
                    Ngày chi tiêu
                </label>
                <Calendar
                    inputId="spendingDate"
                    name="spendingDate"
                    className="w-max"
                    value={formik.values.spendingDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    showIcon
                />
                <small id="spendingDate-help" className="p-error block mt-1">
                    {formik.touched.spendingDate && formik.errors.spendingDate}
                </small>
                <label htmlFor="total" className="my-3">
                    Số tiền
                </label>
                <InputText
                    id="total"
                    name="total"
                    type="number"
                    value={formik.values.total}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <small id="total-help" className="p-error block mt-1">
                    {formik.touched.total && formik.errors.total}
                </small>
            </form>
        </Dialog>
    );
};

export default AddSpendingDialog;
