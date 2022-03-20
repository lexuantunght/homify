import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingMask: React.FC = () => {
    return (
        <div className="flex flex-1 items-center">
            <ProgressSpinner />
        </div>
    );
};

export default React.memo(LoadingMask);
