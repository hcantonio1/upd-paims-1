// Step 1: Import React
import * as React from "react";
import { Link } from "gatsby";
import Layout from "../layout";
import { Icon, IconButton, makeStyles } from "@material-ui/core";
import { Typography, Divider, Box, Button, Stack } from '@mui/material';
import { LibraryAddRoundedIcon, UpdateRoundedIcon } from "@material-ui/icons";



const SubmitPage = () => {
  const useStyles = makeStyles({
    root: {
      padding: 1,
      margin: 10
    },
   
  })

  const classes = useStyles()

  return (
    <Layout pageTitle="SUBMIT A FORM">
      <Box         
        display='flex'
        flexDirection='column'
        className={classes.root}
      >
        <main>
          <Stack
            padding={1}
            spacing={5}
            mt={2}
            direction="row" 
            justifyContent="center"
          >
            <Stack item>
              <Box      
                height={250}
                width={250}
                my={4}
                display="flex"
                flexDirection='column'
                alignItems="center"
                gap={4}
                p={2}
                sx={{ border: '2px solid green' }}
              >
                {/* <IconButton aria-label="delete" size="large">
                  <LibraryAddRoundedIcon />
                </IconButton> */}

                <h3 fontWeight="bold" text-align="center"> Insert a Record into the Database</h3>

                <Box sx={{ mb: 3 }}>
                  <Button href="/app/form_addrec/" variant="outlined" size="small" color="success"> 
                    INSERT
                  </Button>
                </Box>

              </Box>
            </Stack>

            <Stack item>
              <Box      
                height={250}
                width={250}
                my={4}
                display="flex"
                flexDirection='column'
                alignItems="center"
                gap={4}
                p={2}
                sx={{ border: '2px solid gold' }}
              >
                <h3 fontWeight="bold" text-align="center"> Update or Archive a Record in the Database</h3>

                <Box sx={{ mb: 3 }}>
                  <Button href="/app/form_updaterec/" variant="outlined" size="small" color="success"> 
                    UPDATE/ARCHIVE
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Stack>
{/* 
          <div>
            <Link to="/app/form_addrec/">Create Record</Link>
            <br />
            <Link to="/app/form_updaterec/">Update Record</Link>
            <br />
            <Link to="/app/form_archiverec/">Archive Record</Link>
          </div> */}
        </main>
      </Box>
    </Layout>
  );
};

// You'll learn about this in the next task, just copy it for now
export const Head = () => <title>Submit Form</title>;

// Step 3: Export your component
export default SubmitPage;

//personal notes
//current problems with adding record:
//lengthy process if doing it one by one per property
//current problems with updating record:
//
