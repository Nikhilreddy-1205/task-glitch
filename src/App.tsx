import { Container, Stack } from '@mui/material';
import TaskTable from '@/components/TaskTable';
import UndoSnackbar from '@/components/UndoSnackbar';
import { useTasks } from '@/hooks/useTasks';

export default function App() {
  const {
    derivedSorted,
    addTask,
    updateTask,
    deleteTask,
    undoDelete,
    lastDeleted,
  } = useTasks();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <TaskTable
          tasks={derivedSorted}
          onAdd={addTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />

        <UndoSnackbar
          open={!!lastDeleted}
          onUndo={undoDelete}
          onClose={() => {}}
        />
      </Stack>
    </Container>
  );
}
