import React from 'react';
import { useTranslation } from 'react-i18next';

type StatusType = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { t } = useTranslation();
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: t('statusBadge.pending')
        };
      case 'IN_PROGRESS':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: t('statusBadge.inProgress')
        };
      case 'RESOLVED':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          label: t('statusBadge.resolved')
        };
      case 'REJECTED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          label: t('statusBadge.rejected')
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: status
        };
    }
  };

  const { color, label } = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color} ${className || ''}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
