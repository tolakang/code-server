import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import { getAuditLogs, exportAuditLogs, getAuditSummary } from '../api/auditApi';

interface AuditLog {
  id: string;
  user_id: string;
  username?: string;
  action: string;
  resource: string;
  details: any;
  ip_address: string;
  created_at: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [summary, setSummary] = useState<{
    total: number;
    today: number;
    byAction: { action: string; count: number }[];
    byResource: { resource: string; count: number }[];
  } | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (filterType === 'user' && filterValue) params.user_id = filterValue;
        if (filterType === 'resource' && filterValue) params.resource = filterValue;
        if (searchQuery) params.action = searchQuery;
        const result = await getAuditLogs(params);
        setLogs(result.logs);
        setTotal(result.total);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSummary = async () => {
      try {
        const data = await getAuditSummary();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching audit summary:', error);
      }
    };

    fetchAuditLogs();
    fetchSummary();
  }, [filterType, filterValue, searchQuery]);

  const handleSearch = () => {
    setFilterType('search');
  };

  const handleFilterChange = (event: any) => {
    setFilterType(event.target.value as string);
    setFilterValue('');
  };

  const handleExport = async () => {
    try {
      const blob = await exportAuditLogs();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audit-logs.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting audit logs:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Audit Logs
      </Typography>

      {summary && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Chip label={`Total: ${summary.total}`} color="primary" />
          <Chip label={`Today: ${summary.today}`} color="secondary" />
          {summary.byAction.map((item) => (
            <Chip key={item.action} label={`${item.action}: ${item.count}`} />
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select value={filterType} label="Filter Type" onChange={handleFilterChange}>
            <MenuItem value="all">All Logs</MenuItem>
            <MenuItem value="user">By User</MenuItem>
            <MenuItem value="resource">By Resource</MenuItem>
          </Select>
        </FormControl>

        {filterType === 'user' && (
          <TextField label="User ID" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} sx={{ minWidth: 200 }} />
        )}

        {filterType === 'resource' && (
          <TextField label="Resource" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} sx={{ minWidth: 200 }} />
        )}

        <TextField label="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ minWidth: 300 }} />
        <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}>Search</Button>
        <Button variant="outlined" onClick={() => setExportDialogOpen(true)} startIcon={<DownloadIcon />}>Export</Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell>{log.username || log.user_id}</TableCell>
                  <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                  <TableCell>{log.ip_address}</TableCell>
                  <TableCell>{JSON.stringify(log.details)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>Export Audit Logs</DialogTitle>
        <DialogContent>
          <Typography>Export all audit logs as JSON.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExport} variant="contained">Export</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditLogs;
