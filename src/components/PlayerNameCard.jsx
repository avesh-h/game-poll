'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { isAllowToEditPlayersDetails } from '@/lib/utils/editPlayerDetails';

export default function PlayerNameCard({
  player,
  setIsEdit,
  session,
  removeHandler,
}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Stack direction={'row'}>
        <CardContent sx={{ display: 'flex', gap: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" component="div">
              Player Name
            </Typography>
            <Typography variant="p">{player?.playerName}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" component="div">
              Position
            </Typography>
            <Typography variant="p">{player?.position}</Typography>
          </Box>
        </CardContent>
        <CardActions>
          {isAllowToEditPlayersDetails(player, session?.data?.user?.id) && (
            <>
              <Button size="small" onClick={() => setIsEdit(true)}>
                Edit
              </Button>
              <Button size="small" onClick={() => removeHandler(player)}>
                <DeleteIcon color="error" />
              </Button>
            </>
          )}
        </CardActions>
      </Stack>
    </Card>
  );
}
