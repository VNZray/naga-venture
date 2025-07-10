import { ThemedText } from '@/components/ThemedText';
import React from 'react';

interface SupportTicketTableProps {
  tickets: any[];
  onViewDetails: (ticket: any) => void;
}

const getStatusColor = (status: string) => {
  switch ((status || '').toLowerCase()) {
    case 'in review':
      return '#ffc107';
    case 'resolved':
      return '#28a745';
    case 'closed':
      return '#dc3545';
    default:
      return '#6c757d';
  }
};

const SupportTicketTable: React.FC<SupportTicketTableProps> = ({
  tickets,
  onViewDetails,
}) => {
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '12px 0',
          borderBottom: '1px solid #eee',
          fontWeight: 600,
          color: '#222',
        }}
      >
        <ThemedText
          type="defaultSemiBold"
          style={{ width: '12%', color: '#000' }}
        >
          Type
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={{ width: '22%', color: '#000' }}
        >
          Subject
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={{ width: '28%', color: '#000' }}
        >
          Description
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={{ width: '12%', color: '#000' }}
        >
          Status
        </ThemedText>
        <ThemedText type="default" style={{ width: '14%', color: '#000' }}>
          Created
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={{ width: '12%', color: '#000' }}
        ></ThemedText>
      </div>
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '14px 0',
            borderBottom: '1px solid #f2f2f2',
            background: '#fff',
          }}
        >
          <ThemedText type="default" style={{ width: '12%', color: '#000' }}>
            {ticket.type}
          </ThemedText>
          <ThemedText type="default" style={{ width: '22%', color: '#000' }}>
            {ticket.subject}
          </ThemedText>
          <ThemedText type="default" style={{ width: '28%', color: '#000' }}>
            {ticket.message}
          </ThemedText>
          <div style={{ width: '12%' }}>
            <div
              style={{
                background: getStatusColor(ticket.status) + '20',
                borderRadius: 12,
                display: 'inline-block',
                padding: '4px 12px',
              }}
            >
              <ThemedText
                type="default"
                style={{
                  color: '#000',
                  fontWeight: 300,
                  fontSize: 13,
                  fontFamily: 'Poppins-SemiBold',
                }}
              >
                {ticket.status}
              </ThemedText>
            </div>
          </div>
          <ThemedText type="default" style={{ width: '14%', color: '#000' }}>
            {new Date(ticket.created_at).toLocaleString()}
          </ThemedText>
          <div style={{ width: '12%' }}>
            <button
              onClick={() => onViewDetails(ticket)}
              style={{
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '7px 16px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: 'Poppins-SemiBold',
              }}
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupportTicketTable;
