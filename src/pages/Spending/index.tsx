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
import Expand from 'react-expand-animated';
import { useFetchSpendings } from '../../controllers/SpendingController';
import LoadingMask from '../../common/components/LoadingMask';
import moment from 'moment';

const SpendingPage: React.FC = () => {
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const { data: dataSpending, isLoading: isLoadingSpending } =
        useFetchSpendings();

    if (isLoadingSpending) {
        return <LoadingMask />;
    }

    return (
        <div className="mt-4 w-full">
            <Fieldset legend="Danh sách chi tiêu">
                <div className="flex justify-end">
                    <Button icon="pi pi-plus" label="Thêm chi tiêu" />
                </div>
                <Divider />
                <form className="mb-10">
                    <Expand open={showAdvanced} duration={300}>
                        <div className="grid lg:grid-cols-3 gap-3">
                            <div className="flex space-x-3 items-center">
                                <label htmlFor="spendingDate" className="w-28">
                                    Ngày chi tiêu
                                </label>
                                <Calendar
                                    id="spendingDate"
                                    selectionMode="range"
                                    readOnlyInput
                                    showIcon
                                />
                            </div>
                            <div className="flex space-x-3 items-center lg:justify-center">
                                <label htmlFor="spendingType" className="w-28">
                                    Loại chi tiêu
                                </label>
                                <Dropdown id="spendingType" options={[]} />
                            </div>
                            <div className="flex space-x-3 items-center lg:justify-end">
                                <label
                                    htmlFor="spendingMethod"
                                    className="w-28"
                                >
                                    Hình thức
                                </label>
                                <Dropdown id="spendingMethod" options={[]} />
                            </div>
                        </div>
                    </Expand>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-end lg:space-x-10 mt-3 space-y-3 lg:space-y-0">
                        <div className="flex space-x-3 items-center">
                            <label htmlFor="name" className="w-28">
                                Tên chi tiêu
                            </label>
                            <InputText id="name" />
                        </div>
                        <Button
                            icon="pi pi-search"
                            className="w-max"
                            label="Tìm kiếm"
                        />
                    </div>
                    <div className="flex space-x-3 lg:justify-end mt-4">
                        <Checkbox
                            inputId="advanced"
                            checked={showAdvanced}
                            onChange={(e) => setShowAdvanced(e.checked)}
                        />
                        <label htmlFor="advanced">Nâng cao</label>
                    </div>
                </form>
                <DataTable
                    value={dataSpending?.spendings.map((spending, id) =>
                        Object.assign(spending, { id: id + 1 })
                    )}
                    showGridlines
                    emptyMessage="Không có dữ liệu"
                    rowHover
                    responsiveLayout="scroll"
                >
                    <Column field="id" header="#"></Column>
                    <Column field="name" header="Tên"></Column>
                    <Column
                        field="spending_type"
                        header="Loại chi tiêu"
                    ></Column>
                    <Column field="spending_method" header="Hình thức"></Column>
                    <Column
                        field="created_at"
                        header="Ngày chi tiêu"
                        body={(rowData) =>
                            moment(rowData.created_at).format('yyyy-MM-DD')
                        }
                    ></Column>
                    <Column
                        field="total"
                        header="Số tiền"
                        body={(rowData) => rowData.total?.toLocaleString()}
                    ></Column>
                    <Column
                        header="Thao tác"
                        body={() => (
                            <>
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-text p-button-success"
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-text p-button-danger"
                                />
                            </>
                        )}
                    ></Column>
                </DataTable>
            </Fieldset>
        </div>
    );
};

export default SpendingPage;
