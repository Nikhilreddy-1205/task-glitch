import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { DerivedTask, Task } from '@/types';
import TaskForm from '@/components/TaskForm';
import TaskDetailsDialog from '@/components/TaskDetailsDialog';

interface Props {
  tasks: DerivedTask[];
  onAdd: (payload: Omit<Task, 'id'>) => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskTable({ tasks, onAdd, onUpdate, onDelete }: Props) {
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [viewing, setViewing] = useState<Task | null>(null);

  const existingTitles = useMemo(() => tasks.map(t => t.title), [tasks]);

  const handleAddClick = () => {
    setEditing(null);
    setViewing(null);
    setOpenForm(true);
  };

  const handleEditClick = (task: Task) => {
    setViewing(null);
    setEditing(task);
    setOpenForm(true);
  };

  const handleViewClick = (task: Task) => {
    setEditing(null);
    setViewing(task);
  };

  const handleSubmit = (value: Omit<Task, 'id'> & { id?: string }) => {
    if (value.id) {
      const { id, ...rest } = value as Task;
      onUpdate(id, rest);
    } else {
      onAdd(value as Omit<Task, 'id'>);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            Tasks
          </Typography>
          <Button startIcon={<AddIcon />} variant="contained" onClick={handleAddClick}>
            Add Task
          </Button>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Revenue</TableCell>
                <TableCell align="right">Time</TableCell>
                <TableCell align="right">ROI</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tasks.map(t => (
                <TableRow key={t.id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell align="right">${t.revenue}</TableCell>
                  <TableCell align="right">{t.timeTaken}</TableCell>
                  <TableCell align="right">{t.roi}</TableCell>
                  <TableCell>{t.priority}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View">
                        <IconButton onClick={() => handleViewClick(t)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditClick(t)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => onDelete(t.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {tasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box py={4} textAlign="center">
                      No tasks
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <TaskForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        existingTitles={existingTitles}
        initial={editing}
      />

      <TaskDetailsDialog
        open={Boolean(viewing)}
        task={viewing}
        onClose={() => setViewing(null)}
        onSave={onUpdate}
      />
    </Card>
  );
}
