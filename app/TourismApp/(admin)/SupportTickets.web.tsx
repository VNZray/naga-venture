import SearchBar from '@/components/SearchBar';
import SupportTicketTable from '@/components/support/SupportTicketTable';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CategoryFilter from '@/components/touristSpot/webComponents/CategoryFilter';
import Pagination from '@/components/touristSpot/webComponents/Pagination';
import { supabase } from '@/utils/supabase';
import { useEffect, useMemo, useState } from 'react';

const TICKET_TYPES = ['All', 'feedback', 'report'];
const STATUS_TYPES = ['All', 'Submitted', 'In Review', 'Resolved', 'Closed'];
const TICKETS_PER_PAGE = 10;

const SupportTicketsWeb = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [adminStatus, setAdminStatus] = useState('In Review');
  const [adminReply, setAdminReply] = useState('');

  useEffect(() => {
    setLoading(true);
    supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setLoading(false);
        if (!error) setTickets(data || []);
        else setError(error.message);
      });
  }, []);

  const fetchTimeline = async (ticketId: number) => {
    const { data } = await supabase
      .from('support_ticket_timelines')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('event_time', { ascending: true });
    setTimeline(data || []);
  };

  const handleViewDetails = async (ticket: any) => {
    setSelectedTicket(ticket);
    setAdminStatus(ticket.status);
    setAdminReply('');
    await fetchTimeline(ticket.id);
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle || !updateDescription) {
      alert('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    await supabase.from('support_ticket_timelines').insert([
      {
        ticket_id: selectedTicket.id,
        title: updateTitle,
        description: updateDescription,
      },
    ]);
    setUpdateTitle('');
    setUpdateDescription('');
    setSubmitting(false);
    await fetchTimeline(selectedTicket.id);
    setShowUpdateModal(false);
    alert('Timeline update added!');
  };

  // Filtering, searching, and pagination
  const filteredTickets = useMemo(() => {
    let filtered = tickets;
    if (typeFilter !== 'All')
      filtered = filtered.filter((t) => t.type === typeFilter);
    if (statusFilter !== 'All')
      filtered = filtered.filter((t) => t.status === statusFilter);
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.message?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [tickets, typeFilter, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredTickets.length / TICKETS_PER_PAGE);
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * TICKETS_PER_PAGE;
    const endIndex = startIndex + TICKETS_PER_PAGE;
    return filteredTickets.slice(startIndex, endIndex);
  }, [filteredTickets, currentPage]);

  // Table row color by status
  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'submitted':
        return '#007bff';
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

  return (
    <ThemedView style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <CategoryFilter
          categories={TICKET_TYPES}
          selectedCategory={typeFilter}
          onCategorySelect={(cat) => {
            setTypeFilter(cat);
            setCurrentPage(1);
          }}
        />
        <CategoryFilter
          categories={STATUS_TYPES}
          selectedCategory={statusFilter}
          onCategorySelect={(cat) => {
            setStatusFilter(cat);
            setCurrentPage(1);
          }}
        />
        <div style={{ flex: 1, maxWidth: 300 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearch={() => {}}
            placeholder="Search tickets..."
            containerStyle={{
              height: 40,
              backgroundColor: '#fff',
              borderRadius: 8,
            }}
            inputStyle={{ height: 40, fontSize: 16 }}
          />
        </div>
      </div>
      <ThemedView
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 20,
          minHeight: 300,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : error ? (
          <ThemedText style={{ color: 'red' }}>Error: {error}</ThemedText>
        ) : paginatedTickets.length === 0 ? (
          <ThemedText>No tickets found.</ThemedText>
        ) : (
          <SupportTicketTable
            tickets={paginatedTickets}
            onViewDetails={handleViewDetails}
          />
        )}
        <div style={{ marginTop: 24 }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </ThemedView>
      {/* Details Modal */}
      {selectedTicket && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 32,
              minWidth: 400,
              maxWidth: 600,
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedTicket(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
            <ThemedText
              type="subtitle"
              style={{ marginBottom: 8, fontSize: 20 }}
            >
              {selectedTicket.subject}
            </ThemedText>
            <div style={{ marginBottom: 8, color: '#888' }}>
              {selectedTicket.type} • {selectedTicket.status}
            </div>
            <div style={{ marginBottom: 16 }}>{selectedTicket.message}</div>
            <div style={{ marginBottom: 16 }}>
              <strong>Timeline:</strong>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {timeline.map((event, idx) => (
                  <li
                    key={event.id}
                    style={{
                      marginBottom: 12,
                      padding: 12,
                      background: '#f8f8f8',
                      borderRadius: 6,
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                    <div style={{ color: '#555', marginBottom: 4 }}>
                      {event.description}
                    </div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      {new Date(event.event_time).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Admin status/reply form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!adminReply) {
                  alert('Please enter a reply.');
                  return;
                }
                setSubmitting(true);
                // Update ticket status
                await supabase
                  .from('support_tickets')
                  .update({ status: adminStatus })
                  .eq('id', selectedTicket.id);
                // Add reply as timeline event
                await supabase.from('support_ticket_timelines').insert([
                  {
                    ticket_id: selectedTicket.id,
                    title: 'Admin Reply',
                    description: adminReply,
                  },
                ]);
                setAdminReply('');
                setSubmitting(false);
                alert('Status and reply updated!');
                // Refresh ticket and timeline
                setSelectedTicket({ ...selectedTicket, status: adminStatus });
                await fetchTimeline(selectedTicket.id);
              }}
              style={{ marginBottom: 24 }}
            >
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontWeight: 'bold',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  Change Status
                </label>
                <select
                  value={adminStatus}
                  onChange={(e) => setAdminStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    fontSize: 16,
                  }}
                >
                  {STATUS_TYPES.filter((status) => status !== 'All').map(
                    (status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontWeight: 'bold',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  Admin Reply
                </label>
                <textarea
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    fontSize: 16,
                    resize: 'vertical',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: '#28a745',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  width: '100%',
                }}
              >
                {submitting ? 'Saving...' : 'Save Status & Reply'}
              </button>
            </form>
            <button
              onClick={() => setShowUpdateModal(true)}
              style={{
                background: '#007AFF',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 20px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Add Timeline Update
            </button>
          </div>
        </div>
      )}
      {/* Add Update Modal */}
      {showUpdateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.2)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 32,
              minWidth: 400,
              maxWidth: 500,
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowUpdateModal(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
            <ThemedText
              type="subtitle"
              style={{ marginBottom: 16, fontSize: 18 }}
            >
              Add Timeline Update
            </ThemedText>
            <form onSubmit={handleAddUpdate}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontWeight: 'bold',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    fontSize: 16,
                  }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    fontWeight: 'bold',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  Description
                </label>
                <textarea
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    fontSize: 16,
                    resize: 'vertical',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: '#007AFF',
                  color: '#fff',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  width: '100%',
                }}
              >
                {submitting ? 'Submitting...' : 'Add Update'}
              </button>
            </form>
          </div>
        </div>
      )}
    </ThemedView>
  );
};

export default SupportTicketsWeb;
