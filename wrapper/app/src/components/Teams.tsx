import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getTeams, createTeam, deleteTeam, updateTeam, Team } from '../api/teamApi';

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, []);

  const handleOpen = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setTeamName(team.name);
      setTeamDescription(team.description || '');
      setMembers(team.members || []);
    } else {
      setEditingTeam(null);
      setTeamName('');
      setTeamDescription('');
      setMembers([]);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      if (editingTeam) {
        await updateTeam(editingTeam.id, {
          name: teamName,
          description: teamDescription,
          members
        });
        setTeams(teams.map(team => team.id === editingTeam.id ? { ...team, name: teamName, description: teamDescription, members } : team));
      } else {
        const newTeam = await createTeam({
          name: teamName,
          description: teamDescription,
          members
        });
        setTeams([...teams, newTeam]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  const handleDelete = async (teamId: string) => {
    try {
      await deleteTeam(teamId);
      setTeams(teams.filter(team => team.id !== teamId));
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const addMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers([...members, newMember]);
      setNewMember('');
    }
  };

  const removeMember = (member: string) => {
    setMembers(members.filter(m => m !== member));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Teams</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Create Team
        </Button>
      </Box>

      <List>
        {teams.map((team) => (
          <ListItem key={team.id} secondaryAction={
            <Box>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(team)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(team.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          }>
            <ListItemAvatar>
              <Avatar>
                <GroupIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={team.name} secondary={team.description} />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingTeam ? 'Edit Team' : 'Create Team'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            fullWidth
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Members</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {members.map((member) => (
              <Chip
                key={member}
                label={member}
                onDelete={() => removeMember(member)}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <TextField
              label="Add Member"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              fullWidth
            />
            <Button variant="outlined" onClick={addMember}>
              Add
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingTeam ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teams;