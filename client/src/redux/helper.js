export const mergeData = (state, key, action) => {
  const hasNestedDataObject = Array.isArray(state[key]?.data?.data);

  if (hasNestedDataObject) {
    if (!action?.mergeData || !state[key]?.data?.data?.length) {
      return action?.data;
    }

    return {
      ...action?.data,
      data: [...state[key]?.data?.data, ...action?.data?.data],
    };
  }

  if (!action?.mergeData || !state[key]?.data?.length) {
    return action?.data;
  }

  return [...state[key]?.data, ...action?.data];
};
