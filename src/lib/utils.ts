// Utility functions for CRM

export const formatCurrency = (amount: number): string => {
  return `GH₵{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const getDealStatusColor = (status: string): string => {
  switch (status) {
    case 'Won':
      return 'bg-green-100 text-green-800';
    case 'Lost':
      return 'bg-red-100 text-red-800';
    case 'Qualification':
      return 'bg-blue-100 text-blue-800';
    case 'Proposal Sent':
      return 'bg-purple-100 text-purple-800';
    case 'Negotiation':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getLeadStatusColor = (status: string): string => {
  switch (status) {
    case 'Customer':
      return 'bg-green-100 text-green-800';
    case 'New':
      return 'bg-blue-100 text-blue-800';
    case 'Contacted':
      return 'bg-yellow-100 text-yellow-800';
    case 'Qualified':
      return 'bg-purple-100 text-purple-800';
    case 'Lost':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const calculateProbabilityColor = (probability: number): string => {
  if (probability >= 80) return 'bg-green-100 text-green-800';
  if (probability >= 50) return 'bg-yellow-100 text-yellow-800';
  if (probability >= 20) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
