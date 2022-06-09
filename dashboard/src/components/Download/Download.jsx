import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import  fdp  from '../../resources/imgs/fdp.png'
import  java  from '../../resources/imgs/java.png'
import  zip  from '../../resources/imgs/zip.png'
import  web  from '../../resources/imgs/web.png'

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export function CableView() {
  return (
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        maxWidth: '500',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography gutterBottom variant="subtitle1" component="div">
              CableView
            </Typography>
            <Typography variant="body2" gutterBottom>
              CableView is this portal. To learn more about how to use it, download the manual below.
            </Typography>
          </Grid>
        </Grid>
      </Grid>      
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/help/panaccess/pcv_doc_en_EN_manual.pdf"> <Img alt="PDF" src = {fdp} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2} marginTop={5}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                The CableView manual.
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              12 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export function Headcontrol() {
  return (
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        maxWidth: '500',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography gutterBottom variant="subtitle1" component="div">
              Headcontrol
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={3} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/help/panaccess/hc_doc_en_EN_quickinstall.pdf"> <Img alt="PDF" src = {fdp} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2} marginTop={5}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                The Headcontrol installation manual
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              0.5 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={3} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/help/panaccess/hc_doc_de_DE_quickinstall.pdf"> <Img alt="PDF" src = {fdp} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2} marginTop={5}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Die Headcontrol Installationsanleitung
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              0.5 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export function SpoolNik() {
  return (
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        maxWidth: '500',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography gutterBottom variant="subtitle1" component="div">
              SpoolNik
            </Typography>
            <Typography variant="body2" gutterBottom>
              SpoolNik is our EPG Spooler build upon our Service Framework platform, that can spool EPG data and various other data like NIT and TDT
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/spoolnik/SpoolNik%20Manual.pdf"> <Img alt="PDF" src = {fdp} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2} marginTop={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                SpoolNik manual.
              </Typography>
              <Typography gutterBottom variant="subtitle2" component="div">
                The manual describing how to set up the SpoolNik services.
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              1.5 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="http://www.panaccess.com/epgsi-generator/#SFRemoteControl"> <Img alt="WEB" src = {web} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2} marginTop={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                SF Remote Control for Windows
              </Typography>
              <Typography gutterBottom variant="subtitle2" component="div">
                The client for windows used to connect to our Service Framwork Tools like SpoolNik.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="http://www.panaccess.com/epgsi-generator/#SFRemoteControl"> <Img alt="WEB" src = {web} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2} marginTop={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                SF Remote Control for iOS/Linux
              </Typography>
              <Typography gutterBottom variant="subtitle2" component="div">
                The client for other systems (requires Java 1.6+) used to connect to our Service Framwork Tools like SpoolNik.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/serviceframework/SFRemoteControl%20Manual.pdf"> <Img alt="PDF" src = {fdp} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2} marginTop={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                SFRemoteControl Manual
              </Typography>
              <Typography gutterBottom variant="subtitle2" component="div">
                The manual describing how to use the SFRemoteControl software.
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              0.9 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>































    </Paper>
  );
}

export function WSDLAPI() {
  return (
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        maxWidth: '500',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography gutterBottom variant="subtitle1" component="div">
              WSDL API
            </Typography>
            <Typography variant="body2" gutterBottom>
              Most CableView functionality can be accessed using our SOAP based WSDL API.
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/?requestMode=wsdl&v=4.3&r=operator"> <Img alt="WEB" src = {web} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2} marginTop={5}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Stable WSDL API V4.3 description
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/?requestMode=wsdl&v=4.3&r=operator&dev=true"> <Img alt="WEB" src = {web} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column">
            <Grid item xs >
              <Typography marginTop={3} gutterBottom variant="subtitle1" component="div">
                Unstable WSDL API V4.3 description
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography gutterBottom variant="body2" component="div">
                The unstable WSDL API V4.3 description. This API has all stable API functions plus many functions which might change in signature or name over time and only will be stabelized on request.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/wsdl/cv-wsdl-csharp-example.zip"> <Img alt="ZIP" src = {zip} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column">
            <Grid item xs>
              <Typography marginTop={3} gutterBottom variant="subtitle1" component="div">
                Example C# CV SWDL
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle2" component="div">
                An example C# project created with Sharp Develop 5.1
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              0.1 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/wsdl/cv-wsdl-php-example.zip"> <Img alt="ZIP" src = {zip} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column">
            <Grid item xs>
              <Typography marginTop={3} gutterBottom variant="subtitle1" component="div">
                Example PHP CV WSDL
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle2" component="div">
                An example implementation using PHP and NuSOAP
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              0.1 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/wsdl/cv-wsdl-java-example.zip"> <Img alt="ZIP" src = {zip} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column">
            <Grid item xs>
              <Typography marginTop={3} gutterBottom variant="subtitle1" component="div">
                Example JAVA CV WSDL
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle2" component="div">
                An example Java project created with Eclipse 3.7
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              4.7 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/wsdl/cv-json-javascript-example.zip"> <Img alt="ZIP" src = {zip} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column">
            <Grid item xs>
              <Typography marginTop={3} gutterBottom variant="subtitle1" component="div">
                Example JavaScript CV WSDL
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle2" component="div">
                An example Javascript that uses the JSON/JSONP API to make its calls
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              0.07 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/wsdl/de.panaccess.cableview.wsdl.v4_3.633.operator.jar"> <Img alt="JAVA" src = {java} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column">
            <Grid item xs>
              <Typography marginTop={3} gutterBottom variant="subtitle1" component="div">
                Panaccess cableview wsdl api operators V4.2
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle2" component="div">
                Generated Java lib for the stable WSDL API V4.2 for operators
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              0.5 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/wsdl/de.panaccess.cableview.wsdl.v4_3.633.operator.dev.jar"> <Img alt="JAVA" src = {java} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column">
            <Grid item xs>
              <Typography marginTop={3} gutterBottom variant="subtitle1" component="div">
                Panaccess cableview wsdl api operators V4.2 dev
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle2" component="div">
                Generated Java lib for the unstable WSDL API V4.2 for operators
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              1 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/wsdl/de.panaccess.cableview.wsdl.v4_3.633.subscriber.jar"> <Img alt="JAVA" src = {java} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column">
            <Grid item xs>
              <Typography marginTop={3} gutterBottom variant="subtitle1" component="div">
                Panaccess cableview wsdl api subscribers V4.2 dev
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle2" component="div">
                Generated Java lib for the stable WSDL API V4.2 for subscribers/boxes
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              0.2 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>

    </Paper>
  );
}

export function Tools() {
  return (
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        maxWidth: '500',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography gutterBottom variant="subtitle1" component="div">
              Tools
            </Typography>
            <Typography variant="body2" gutterBottom>
              A collection of tools to use in relation to CableView
            </Typography>
          </Grid>
        </Grid>
      </Grid>      
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <a href="https://cv01.panaccess.com/downloads/tools/addCardsToReseller.jar"> <Img alt="JAVA" src = {java} /> </a>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2} marginTop={5}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Addcards to reseller
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              2.9 MB
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}