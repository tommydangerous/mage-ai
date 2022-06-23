import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();
  const queryParams = router.query;
  const completePath = router.asPath;
  const basePath = completePath.split('?')[0];
  let pathname = '/datasets';
  if (basePath && basePath !== '/') {
    pathname = `${basePath}/datasets`;
  }
  console.log('completePath:', completePath);
  console.log('basePath:', basePath);
  console.log('router pathname:', router.pathname);
  console.log('FE ---------------------------');

  useEffect(() => {
    Router.push({
      pathname,
      query: queryParams,
    });
  });
};

export default Home;
