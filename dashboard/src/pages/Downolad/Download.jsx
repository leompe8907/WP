import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { CableView, Headcontrol, SpoolNik, Tools, WSDLAPI } from '../../components/Download/Download';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export function Download() {
  return (
    <Box sx={{flex:4, margin:2}}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <CableView/>
        </Grid>
        <Grid item xs={12}>
          <Headcontrol/>
        </Grid>
        <Grid item xs={12}>
          <SpoolNik/>
        </Grid>
        <Grid item xs={12}>
          <WSDLAPI/>
        </Grid>
        <Grid item xs={12}>
          <Tools/>
        </Grid>
      </Grid>
    </Box>
  );
}
