export const sortPosts = (a, b) => {
  const dateA = a.data;
  const dateB = b.data;
  let comparison = 0;
  if (dateA > dateB) {
    comparison = -1;
  } else if (dateA < dateB) {
    comparison = 1;
  }
  return comparison;
}