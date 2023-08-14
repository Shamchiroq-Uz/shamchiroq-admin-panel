import { useCallback, useEffect, useState } from "react";
import { useAxios } from "../../hooks/useAxios";
import { BASE_URL_API } from "../../utils/api";
import { User } from "../../model";
import { UserCard } from "../../components/users/UserCard";
import { Box, Grid, Pagination } from "@mui/material";
import { LoadingBackdrop } from "../../components/shared/LoadingBackdrop";

const limit = 10;

const UsersPage = () => {
  const axios = useAxios();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getAllUsers = useCallback(async () => {
    try {
      const users = await axios.get(
        `${BASE_URL_API}/user/getUsers?page=${page}&limit=${limit}`
      );

      const newUsers = users.data.rows as User[];
      const updatedCount = Math.ceil(users.data.count / limit);

      setCount(updatedCount);
      setAllUsers(newUsers);
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    setIsLoading(true);

    getAllUsers().finally(() => {
      setIsLoading(false);
    });
  }, [getAllUsers]);

  if (isLoading) {
    return <LoadingBackdrop isLoading={isLoading} />;
  }

  return (
    <div>
      {allUsers.length > 0 ? (
        <div>
          <Box marginBottom={5}>
            <Grid container spacing={2} marginBottom={5}>
              {allUsers.map((user, idx) => (
                <Grid item xs={4} key={idx + user.id!}>
                  <UserCard user={user} key={idx + user.id} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Pagination
            onChange={(_, nextPage) => setPage(nextPage)}
            count={count}
            variant="outlined"
          />
        </div>
      ) : (
        <div>
          <p>No users found...</p>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
