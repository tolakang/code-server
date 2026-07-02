import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import { getAuditLogs, getAuditLogsByUser, getAuditLogsByResource, searchAuditLogs, exportAuditLogs, getAuditSummary, AuditLog } from '../api/auditApi';

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [summary, setSummary] = useState<{
    totalLogs: number;
    logsByAction: Record<string, number>;
    logsByResourceType: Record<string, number>;
  } | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        let logs;
        switch (filterType) {
          case 'user':
            logs = await getAuditLogsByUser(filterValue);
            break;
          case 'resource':
            logs = await getAuditLogsByResource('all', filterValue);
            break;
          case 'search':
            logs = await searchAuditLogs(searchQuery);
            break;
          default:
            logs = await getAuditLogs();
        }
        setAuditLogs(logs);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSummary = async () => {
      try {
        const summaryData = await getAuditSummary();
        setSummary(summaryData);
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

  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterType(event.target.value as string);
    setFilterValue('');
  };

  const handleExport = async () => {
    try {
      const blob = await exportAuditLogs(exportFormat);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting audit logs:', error);
    }
  };

  const handleExportDialogOpen = () => {
    setExportDialogOpen(true);
  };

  const handleExportDialogClose = () => {
    setExportDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Audit Logs
      </Typography>

      {summary && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Chip label={`Total Logs: ${summary.totalLogs}`} color="primary" />
          {Object.entries(summary.logsByAction).map(([action, count]) => (
            <Chip key={action} label={`${action}: ${count}`} />
          ))}
          {Object.entries(summary.logsByResourceType).map(([resourceType, count]) => (
            <Chip key={resourceType} label={`${resourceType}: ${count}`} />
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select
            value={filterType}
            label="Filter Type"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All Logs</MenuItem>
            <MenuItem value="user">By User</MenuItem>
            <MenuItem value="resource">By Resource</MenuItem>
          </Select>
        </FormControl>

        {filterType === 'user' && (
          <TextField
            label="User ID"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            sx={{ minWidth: 200 }}
          />
        )}

        {filterType === 'resource' && (
          <TextField
            label="Resource ID"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            sx={{ minWidth: 200 }}
          />
        )}

        <TextField
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 300 }}
        />

        <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}>Search</Button>
        <Button variant="outlined" onClick={handleExportDialogOpen} startIcon={<DownloadIcon />}>Export</Button>
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
                <TableCell>Resource Type</TableCell>
                <TableCell>Resource ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>User Agent</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.resourceType}</TableCell>
                  <TableCell>{log.resourceId}</TableCell>
                  <TableCell>{log.userId}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                  <TableCell>{log.userAgent}</TableCell>
                  <TableCell>{JSON.stringify(log.details)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={exportDialogOpen} onClose={handleExportDialogClose}>
        <DialogTitle>Export Audit Logs</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Format</InputLabel>
            <Select
              value={exportFormat}
              label="Format"
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExportDialogClose}>Cancel</Button>
          <Button onClick={handleExport} variant="contained">Export</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditLogs;