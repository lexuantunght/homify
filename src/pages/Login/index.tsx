import React from 'react';
import * as Yup from 'yup';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { FormikHelpers, useFormik } from 'formik';
import { LoginData } from '../../common/models';
import { useLogin } from '../../controllers/AdminController';
import DispatchType from '../../common/constants/DispatchType';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../utils/redux/store';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const userData = useSelector((state: RootState) => state.app.userData);
    const { mutateAsync, data, reset: clearLoginData, isSuccess } = useLogin();

    const onLogin = async (
        values: LoginData,
        { setSubmitting }: FormikHelpers<LoginData>
    ) => {
        await mutateAsync(values);
        setSubmitting(false);
    };

    const formik = useFormik({
        initialValues: { username: '', password: '' },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'Tên tài khoản tối thiểu 3 ký tự')
                .max(64, 'Tên tài khoản tối đa 64 ký tự')
                .required('Tên tài khoản là bắt buộc'),
            password: Yup.string()
                .min(3, 'Mật khẩu tối thiểu 3 ký tự')
                .max(64, 'Mật khẩu tối đa 64 ký tự')
                .required('Mật khẩu là bắt buộc'),
        }),
        onSubmit: onLogin,
    });

    React.useEffect(() => {
        if (isSuccess && data) {
            dispatch({ type: DispatchType.APP.USER_DATA, data });
        }
        return () => {
            clearLoginData();
        };
    }, [isSuccess, data]); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        if (userData) {
            history.push('/');
        }
    }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex flex-1 justify-center items-center">
            <Card className="w-full md:w-1/2 lg:w-1/3">
                <h3 className="text-center mb-8">Đăng nhập ứng dụng</h3>
                <form
                    autoComplete="off"
                    className="space-y-8"
                    onSubmit={formik.handleSubmit}
                >
                    <div className="flex flex-col">
                        <label htmlFor="username" className="mb-2">
                            Tên tài khoản
                        </label>
                        <InputText
                            id="username"
                            name="username"
                            placeholder="Nhập tên tài khoản"
                            className={
                                formik.touched.username &&
                                formik.errors.username
                                    ? 'p-invalid'
                                    : ''
                            }
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <small
                            id="username-help"
                            className="p-error block mt-1"
                        >
                            {formik.touched.username && formik.errors.username}
                        </small>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-2">
                            Mật khẩu
                        </label>
                        <Password
                            id="password"
                            name="password"
                            inputClassName="w-full"
                            feedback={false}
                            toggleMask
                            placeholder="Nhập mật khẩu"
                            className={
                                formik.touched.password &&
                                formik.errors.password
                                    ? 'p-invalid'
                                    : ''
                            }
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <small
                            id="username-help"
                            className="p-error block mt-1"
                        >
                            {formik.touched.password && formik.errors.password}
                        </small>
                    </div>
                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            disabled={!formik.isValid || formik.isSubmitting}
                            label="Đăng nhập"
                            loading={formik.isSubmitting}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;
