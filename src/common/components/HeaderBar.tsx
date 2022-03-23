import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Chip } from 'primereact/chip';
import { confirmDialog } from 'primereact/confirmdialog';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/redux/store';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import DispatchType from '../constants/DispatchType';
import CookiesHelper from '../../utils/helper/CookiesHelper';

const HeaderBar: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const userData = useSelector((state: RootState) => state.app.userData);
    const queryClient = useQueryClient();

    const onLogout = React.useCallback(() => {
        dispatch({ type: DispatchType.APP.USER_DATA, data: undefined });
        CookiesHelper.remove('token');
        queryClient.invalidateQueries();
        history.push('/login');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const confirmLogout = () => {
        confirmDialog({
            message: 'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?',
            header: 'Cảnh báo',
            acceptLabel: 'Đồng ý',
            rejectLabel: 'Huỷ bỏ',
            className: 'w-4/5 md:w-1/2 lg:w-1/3',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: onLogout,
        });
    };

    const items = [
        {
            label: 'Tổng quan',
            icon: 'pi pi-th-large',
            command: () => history.push('/'),
        },
        {
            label: 'Công việc',
            icon: 'pi pi-check-square',
            command: () => history.push('/todo'),
        },
        {
            label: 'Quản lý',
            icon: 'pi pi-file',
            items: [
                {
                    label: 'Chi tiêu',
                    icon: 'pi pi-pencil',
                    command: () => history.push('/spending'),
                },
                {
                    label: 'Thiết lập',
                    icon: 'pi pi-cog',
                    command: () => history.push('/configuration'),
                },
            ],
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-sign-out',
            command: confirmLogout,
        },
    ];

    return (
        <div hidden={!userData}>
            <Menubar
                model={items}
                end={
                    <Chip
                        label={userData?.name}
                        image={userData?.avatar?.url}
                    />
                }
            />
        </div>
    );
};

export default React.memo(HeaderBar);
