import { useState, useMemo, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { debounce } from "@mui/material/utils";
import { Box } from "@mui/material";

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
interface User {
  _id: string;
  email: string;
  role: string;
  structured_formatting: StructuredFormatting;
}

export default function UserSearchInput({ selectedUsers, setSelectedUsers }) {
  const [value, setValue] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [emails, setEmails] = useState<readonly User[]>([]);

  const fetchMemoized = useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly User[]) => void
        ) => {
          if (request.input === "") return callback([]);
          fetch(`http://localhost:3000/users?search=${request.input}`, {
            credentials: "include",
          })
            .then((response) => response.json())
            .then((users) => {
              callback(users);
            });
        },
        400
      ),
    []
  );

  useEffect(() => {
    let active = true;

    if (inputValue !== "")
      fetchMemoized({ input: inputValue }, (results?: readonly User[]) => {
        if (active) {
          let newOptions: readonly User[] = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setEmails(newOptions);
        }
      });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetchMemoized]);

  return (
    <>
      <Box display={"block"}>
        {selectedUsers.map((user) => {
          return <li key={user._id + user.email}>{user.email}</li>;
        })}
      </Box>
      <Autocomplete
        id="username-search"
        sx={{ width: "100%" }}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.email
        }
        filterOptions={(x) => x}
        options={emails}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        noOptionsText="No user"
        onChange={(_: any, newValue: User | null) => {
          if (newValue) {
            if (!selectedUsers.find((user) => user._id === newValue._id)) {
              setSelectedUsers((prev) => [...prev, newValue]);
              setValue(newValue);
            }

            setEmails([]);
            setInputValue("");
          }
        }}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Add a user" fullWidth />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option._id}>
              <Grid container alignItems="center">
                <Grid item sx={{ wordWrap: "break-word" }}>
                  <Typography variant="body2" color="text.secondary">
                    {option.email}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
    </>
  );
}
