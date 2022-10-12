import axios from 'axios';

const deleteRecipe = (recipeId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/api/resepti/${recipeId}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
};

export default deleteRecipe;
