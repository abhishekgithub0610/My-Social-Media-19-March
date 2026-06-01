export const getImageUrl = (path?: string) => {
  if (!path) {
    return "/assets/images/avatar/placeholder.jpg";
  }

  return `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
};
